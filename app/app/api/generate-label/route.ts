import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface DimensionInput {
  id: string
  name: string
  range: [number, number]
}

interface GenerateLabelRequest {
  labelName: string
  labelType: 'region' | 'point'
  domainName: string
  dimensions: DimensionInput[]
}

function buildRegionSchema(dimensions: DimensionInput[]) {
  const properties: Record<string, object> = {}
  const required: string[] = []

  for (const dim of dimensions) {
    properties[dim.id] = {
      type: 'object',
      description: `Range for the "${dim.name}" dimension. Domain range is [${dim.range[0]}, ${dim.range[1]}]. Return a min and max that represent where the label "${dim.name}" falls within this dimension.`,
      properties: {
        min: { type: 'number', description: `Minimum value (>= ${dim.range[0]})` },
        max: { type: 'number', description: `Maximum value (<= ${dim.range[1]})` },
      },
      required: ['min', 'max'],
      additionalProperties: false,
    }
    required.push(dim.id)
  }

  return {
    type: 'object',
    properties: {
      dimensions: {
        type: 'object',
        properties,
        required,
        additionalProperties: false,
      },
    },
    required: ['dimensions'],
    additionalProperties: false,
  }
}

function buildPointSchema(dimensions: DimensionInput[]) {
  const properties: Record<string, object> = {}
  const required: string[] = []

  for (const dim of dimensions) {
    properties[dim.id] = {
      type: 'number',
      description: `Value for the "${dim.name}" dimension. Domain range is [${dim.range[0]}, ${dim.range[1]}]. Return a single value that represents where the label falls within this dimension.`,
    }
    required.push(dim.id)
  }

  return {
    type: 'object',
    properties: {
      dimensions: {
        type: 'object',
        properties,
        required,
        additionalProperties: false,
      },
    },
    required: ['dimensions'],
    additionalProperties: false,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateLabelRequest = await request.json()
    const { labelName, labelType, domainName, dimensions } = body

    if (!labelName || !labelType || !domainName || !dimensions?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: labelName, labelType, domainName, dimensions' },
        { status: 400 }
      )
    }

    const schema = labelType === 'region'
      ? buildRegionSchema(dimensions)
      : buildPointSchema(dimensions)

    const dimensionDescriptions = dimensions
      .map((d) => `  - "${d.name}" (range: [${d.range[0]}, ${d.range[1]}])`)
      .join('\n')

    const typeInstruction = labelType === 'region'
      ? 'For each dimension, provide a min and max range that defines where this label exists within that dimension. The range should be a meaningful sub-region of the domain range.'
      : 'For each dimension, provide a single numeric value that represents where this label falls within that dimension.'

    const prompt = `You are an expert at defining quality domain labels in a conceptual space framework.

Given a quality domain called "${domainName}" with the following dimensions:
${dimensionDescriptions}

Generate appropriate ${labelType === 'region' ? 'dimension ranges' : 'dimension values'} for a label called "${labelName}".

${typeInstruction}

Think carefully about what "${labelName}" means in the context of the "${domainName}" quality domain, and choose values that make semantic sense. The values must be within each dimension's domain range.`

    const response = await openai.responses.create({
      model: 'gpt-4o',
      input: prompt,
      text: {
        format: {
          type: 'json_schema',
          name: 'label_dimensions',
          strict: true,
          schema,
        },
      },
    })

    const outputMessage = response.output.find(
      (o: { type: string }) => o.type === 'message'
    )
    if (!outputMessage || outputMessage.type !== 'message') {
      return NextResponse.json({ error: 'No message in response' }, { status: 500 })
    }

    const textContent = outputMessage.content.find(
      (c: { type: string }) => c.type === 'output_text'
    )
    if (!textContent || textContent.type !== 'output_text') {
      return NextResponse.json({ error: 'No text content in response' }, { status: 500 })
    }

    const parsed = JSON.parse(textContent.text)

    // Transform the response into the format the frontend expects
    if (labelType === 'region') {
      const regionDimensions = dimensions.map((dim) => ({
        dimensionId: dim.id,
        range: [parsed.dimensions[dim.id].min, parsed.dimensions[dim.id].max] as [number, number],
      }))
      return NextResponse.json({ type: 'region', dimensions: regionDimensions })
    } else {
      const pointDimensions = dimensions.map((dim) => ({
        dimensionId: dim.id,
        value: parsed.dimensions[dim.id],
      }))
      return NextResponse.json({ type: 'point', dimensions: pointDimensions })
    }
  } catch (error) {
    console.error('Error generating label:', error)
    return NextResponse.json(
      { error: 'Failed to generate label dimensions' },
      { status: 500 }
    )
  }
}
