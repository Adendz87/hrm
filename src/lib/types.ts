// ─── Block Types ────────────────────────────────────────────────────────────

export type RichTextNode = {
  text: string;
  bold?: boolean;
  link?: string;
};

export interface ParagraphBlock {
  type: "paragraph";
  content: RichTextNode[];
}

export interface HeadingBlock {
  type: "heading";
  content: string;
}

export interface ImageBlock {
  type: "image";
  src: string;
  alt?: string;
}

export type Block = ParagraphBlock | HeadingBlock | ImageBlock;

// ─── Article ────────────────────────────────────────────────────────────────

export interface Article {
  title: string;
  subtitle: string;
  slug: string;
  date: string;
  blocks: Block[];
}

// ─── API Responses ──────────────────────────────────────────────────────────

export interface UploadResponse {
  url: string;
}

export interface GenerateResponse {
  title: string;
  subtitle: string;
  blocks: Block[];
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  image: string;
  date: string;
  created_at: string;
  updated_at: string;
  blocks?: string | Block[]; // Sometimes returned as string, sometimes array
}

export interface NewsListResponse {
  data: NewsItem[];
  total: number;
  page: number;
  limit: number;
}

// ─── Generate Params ────────────────────────────────────────────────────────

export interface GenerateParams {
  title: string;
  subtitle: string;
  text?: string;
  slug: string;
  date: string;
  imageFile?: File | null;
  blocks?: string;
}

export interface UpdateParams {
  title?: string;
  subtitle?: string;
  date?: string;
  imageFile?: File | null;
  blocks?: string;
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LoginParams {
  email: string;
  password?: string;
}

export interface AuthUser {
  email: string;
  name: string;
  employee_code?: string;
  id?: string;
  avatar?: string | null;
  gender?: string | null;
  birthday?: string | null;
  identity_number?: string | null;
  phone?: string | null;
  address?: string | null;
  hire_date?: string | null;
  status?: string | null;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export interface DepartmentPayload {
  code: string;
  name: string;
  description: string;
  is_active: boolean;
}

export interface DepartmentRecord {
  id: string;
  code: string;
  name: string;
  description: string;
  manager_id?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface UserRecord extends AuthUser {
  id: string;
  employee_code: string;
  avatar?: string | null;
  gender?: string | null;
  birthday?: string | null;
  identity_number?: string | null;
  phone?: string | null;
  address?: string | null;
  hire_date?: string | null;
  status?: string | null;
  password?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  department?: {
    id: string;
    code: string;
    name: string;
    description?: string;
    manager_id?: string | null;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
  } | null;
  department_id?: string | null;
  position?: string | null;
}

export interface RegisterEmployeePayload {
  employee_code: string;
  avatar?: string;
  name: string;
  gender: string;
  birthday: string;
  identity_number: string;
  email: string;
  phone: string;
  address: string;
  hire_date: string;
  status: string;
  password: string;
  department_id: string;
  position: string;
}

export interface RegisterEmployeeResponse {
  user: AuthUser;
}
