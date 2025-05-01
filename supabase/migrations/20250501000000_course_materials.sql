/*
  # Create course_materials table and storage configuration

  1. New Tables
    - `course_materials`
      - `id` (uuid, primary key)
      - `title` (text)
      - `course_id` (text)
      - `week` (text)
      - `type` (text)
      - `format` (text)
      - `file_path` (text)
      - `file_size` (text)
      - `teacher_id` (uuid, references profiles.id)
      - `teacher_name` (text)
      - `upload_date` (date)
      - `notes` (text)
      - `assigned_to` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Storage
    - Create a bucket for course materials
    - Set up policies for teachers to upload and everyone to download

  3. Security
    - Enable RLS on course_materials table
    - Add policies for authenticated users to read materials
    - Add policies for teachers to create, update, and delete their own materials
*/

-- Create course_materials table
CREATE TABLE IF NOT EXISTS course_materials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  course_id text NOT NULL,
  week text NOT NULL,
  type text NOT NULL,
  format text NOT NULL,
  file_path text NOT NULL,
  file_size text NOT NULL,
  teacher_id uuid REFERENCES profiles(id),
  teacher_name text NOT NULL,
  upload_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  assigned_to text NOT NULL DEFAULT 'All Students',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Everyone can read materials
CREATE POLICY "Anyone can read course materials"
  ON course_materials
  FOR SELECT
  TO authenticated
  USING (true);

-- Teachers can create materials
CREATE POLICY "Teachers can create course materials"
  ON course_materials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.user_type = 'teacher' OR profiles.user_type = 'admin')
    )
  );

-- Teachers can update their own materials
CREATE POLICY "Teachers can update their own course materials"
  ON course_materials
  FOR UPDATE
  TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- Teachers can delete their own materials
CREATE POLICY "Teachers can delete their own course materials"
  ON course_materials
  FOR DELETE
  TO authenticated
  USING (teacher_id = auth.uid());

-- Create storage bucket for course materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('course_materials', 'Course Materials', false);

-- Allow authenticated users to read from the bucket
CREATE POLICY "Authenticated users can read course materials"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'course_materials');

-- Allow teachers to upload to the bucket
CREATE POLICY "Teachers can upload course materials"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'course_materials'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.user_type = 'teacher' OR profiles.user_type = 'admin')
    )
  );

-- Allow teachers to update their own files
CREATE POLICY "Teachers can update their own course materials"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'course_materials'
    AND owner = auth.uid()
  );

-- Allow teachers to delete their own files
CREATE POLICY "Teachers can delete their own course materials"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'course_materials'
    AND owner = auth.uid()
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
CREATE TRIGGER update_course_materials_updated_at
  BEFORE UPDATE ON course_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();