-- Create audits table to store audit results
CREATE TABLE public.audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  audit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  auditor_name TEXT NOT NULL,
  total_items INTEGER NOT NULL,
  yes_count INTEGER NOT NULL,
  no_count INTEGER NOT NULL,
  success_percentage DECIMAL(5,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('draft', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_items table to store individual audit criteria and responses
CREATE TABLE public.audit_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  criteria TEXT NOT NULL,
  response BOOLEAN NOT NULL, -- true for YES, false for NO
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_improvements table to store improvement suggestions
CREATE TABLE public.audit_improvements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  criteria TEXT NOT NULL,
  suggestion TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_improvements ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a business tool)
CREATE POLICY "Allow all operations on audits" 
ON public.audits 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on audit_items" 
ON public.audit_items 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on audit_improvements" 
ON public.audit_improvements 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_audits_updated_at
  BEFORE UPDATE ON public.audits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();