import React from "react";
import { createEmbeddings } from "@/utils-server/openai/create-embedding";
import styles from "./page.module.css";
import { PlotExample } from "./plot.tsx";

export default async function Home() {
  const [{ embedding: catEmbeddingFull }] = await createEmbeddings(['cat'])
  const [{ embedding: catEmbeddingThree }] = await createEmbeddings(['cat'], { dimensions: 3 })
  const [{ embedding: catEmbedding }, { embedding: dogEmbedding }, { embedding: baseballEmbedding }] = await createEmbeddings(['cat', 'cats', 'baseball'], { dimensions: 3 })

  const points = [
    {
      text: 'cat',
      color: 'red',
      x: catEmbedding[0],
      y: catEmbedding[1],
      z: catEmbedding[2],
    },
    {
      text: 'cats',
      color: 'green',
      x: dogEmbedding[0],
      y: dogEmbedding[1],
      z: dogEmbedding[2],
    }, {
      text: 'baseball',
      color: 'orange',
      x: baseballEmbedding[0],
      y: baseballEmbedding[1],
      z: baseballEmbedding[2],
    }
  ]

  return (
    <div>
      <div>
        cat (dimensions {catEmbeddingFull.length})<span style={{ marginLeft: '54px' }}></span>: {JSON.stringify(catEmbeddingFull).slice(0, 200)}...
      </div>
      <div>
        cat (reduced to 3 dimensions): {JSON.stringify(catEmbeddingThree)}
      </div>

      <br />
      <br />

      <div>cat: {JSON.stringify(catEmbedding)}</div>
      <div>dog: {JSON.stringify(dogEmbedding)}</div>
      <div>baseballEmbedding: {JSON.stringify(baseballEmbedding)}</div>
      <PlotExample points={points} />


    </div>
  );
}
