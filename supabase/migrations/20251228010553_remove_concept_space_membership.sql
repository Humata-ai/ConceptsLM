-- Remove the concept_space_membership table
-- This table linked Concepts to Conceptual Spaces
-- We are removing it because Concepts should only be linked to Conceptual Space Objects

-- Drop the indexes first
DROP INDEX IF EXISTS idx_concept_space_membership_concept;
DROP INDEX IF EXISTS idx_concept_space_membership_space;

-- Drop the table (this will automatically drop the foreign key constraints)
DROP TABLE IF EXISTS concept_space_membership;
