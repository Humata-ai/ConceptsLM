-- Seed file: Apple Color Instances
-- This links the 'apple' concept to RGB color space with three color variants
-- Requires: rgb_color_space and apple concept to be created first

DO $$
DECLARE
  v_space_id uuid;
  v_apple_concept_id uuid;
  v_red_obj_id uuid;
  v_green_obj_id uuid;
  v_yellow_obj_id uuid;
BEGIN
  -- Get the RGB color space ID
  SELECT id INTO v_space_id
  FROM conceptual_spaces
  WHERE name = 'rgb_color_space';

  IF v_space_id IS NULL THEN
    RAISE EXCEPTION 'RGB color space not found. Please create rgb_color_space first.';
  END IF;

  -- Get the apple concept ID
  SELECT c.id INTO v_apple_concept_id
  FROM concepts c
  JOIN concept_labels cl ON c.id = cl.concept_id
  WHERE cl.label_text = 'Apple' AND cl.language_code = 'en';

  IF v_apple_concept_id IS NULL THEN
    RAISE EXCEPTION 'Apple concept not found. Please run apple.sql first.';
  END IF;

  -- Create three conceptual space objects with RGB values for different apple colors
  -- Red Apple: Crimson red (220, 20, 60) - typical red apple
  INSERT INTO conceptual_space_objects (conceptual_space_id, value)
  VALUES (v_space_id, '{"r": 220, "g": 20, "b": 60}'::jsonb)
  RETURNING id INTO v_red_obj_id;

  -- Green Apple: Green dominant (50, 200, 50) - typical Granny Smith apple
  INSERT INTO conceptual_space_objects (conceptual_space_id, value)
  VALUES (v_space_id, '{"r": 50, "g": 200, "b": 50}'::jsonb)
  RETURNING id INTO v_green_obj_id;

  -- Yellow Apple: Golden yellow (255, 220, 0) - typical Golden Delicious apple
  INSERT INTO conceptual_space_objects (conceptual_space_id, value)
  VALUES (v_space_id, '{"r": 255, "g": 220, "b": 0}'::jsonb)
  RETURNING id INTO v_yellow_obj_id;

  -- Link the apple concept to all three color objects in the space
  INSERT INTO concept_space_objects (concept_id, conceptual_space_object_id)
  VALUES
    (v_apple_concept_id, v_red_obj_id),
    (v_apple_concept_id, v_green_obj_id),
    (v_apple_concept_id, v_yellow_obj_id);

  RAISE NOTICE 'Apple color instances created successfully';
  RAISE NOTICE 'Space ID: %', v_space_id;
  RAISE NOTICE 'Apple Concept ID: %', v_apple_concept_id;
  RAISE NOTICE 'Red Apple Object ID: %', v_red_obj_id;
  RAISE NOTICE 'Green Apple Object ID: %', v_green_obj_id;
  RAISE NOTICE 'Yellow Apple Object ID: %', v_yellow_obj_id;
END $$;
