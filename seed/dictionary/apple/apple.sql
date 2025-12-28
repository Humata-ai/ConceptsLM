-- Seed file: Apple Concept
-- This creates the 'apple' concept without any space objects
-- To be used as a base concept that can be linked to various conceptual spaces

DO $$
DECLARE
  v_apple_concept_id uuid;
BEGIN
  -- Create the 'apple' concept
  INSERT INTO concepts DEFAULT VALUES RETURNING id INTO v_apple_concept_id;
  INSERT INTO concept_labels (concept_id, label_text, language_code)
  VALUES (v_apple_concept_id, 'Apple', 'en');

  RAISE NOTICE 'Apple concept created successfully';
  RAISE NOTICE 'Apple Concept ID: %', v_apple_concept_id;
END $$;
