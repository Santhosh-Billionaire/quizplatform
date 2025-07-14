-- Books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  title text,
  file_url text,
  raw_text text,
  created_at timestamp with time zone DEFAULT now()
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  difficulty text,
  category text,
  created_at timestamp with time zone DEFAULT now(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  answer text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  topic_id uuid REFERENCES topics(id) ON DELETE SET NULL,
  difficulty text
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  topics jsonb,
  difficulty text,
  time_limit int4,
  num_questions int4,
  score int4,
  total int4,
  question_ids uuid[]
);

-- Responses table
CREATE TABLE IF NOT EXISTS responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  correct boolean,
  time_taken int4,
  created_at timestamp with time zone DEFAULT now(),
  selected_index int4,
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE
); 