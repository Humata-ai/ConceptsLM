-- Seed file: RGB Color Space
-- This creates a general RGB color space that can be used for any concepts

-- Create the RGB Color Space
INSERT INTO conceptual_spaces (name, value_json_schema)
VALUES (
  'rgb_color_space',
  '{
    "type": "object",
    "properties": {
      "r": {
        "type": "number",
        "minimum": 0,
        "maximum": 255,
        "description": "Red channel value (0-255)"
      },
      "g": {
        "type": "number",
        "minimum": 0,
        "maximum": 255,
        "description": "Green channel value (0-255)"
      },
      "b": {
        "type": "number",
        "minimum": 0,
        "maximum": 255,
        "description": "Blue channel value (0-255)"
      }
    },
    "required": ["r", "g", "b"],
    "additionalProperties": false
  }'::jsonb
);

-- Create quality dimensions for the RGB space
DO $$
DECLARE
  v_space_id uuid;
BEGIN
  -- Get the space ID
  SELECT id INTO v_space_id
  FROM conceptual_spaces
  WHERE name = 'rgb_color_space';

  -- Create quality dimensions
  INSERT INTO quality_dimensions (conceptual_space_id, name, json_schema)
  VALUES
    (v_space_id, 'r', '{"type": "number", "minimum": 0, "maximum": 255}'::jsonb),
    (v_space_id, 'g', '{"type": "number", "minimum": 0, "maximum": 255}'::jsonb),
    (v_space_id, 'b', '{"type": "number", "minimum": 0, "maximum": 255}'::jsonb);

  RAISE NOTICE 'RGB Color Space created successfully';
  RAISE NOTICE 'Space ID: %', v_space_id;
END $$;
