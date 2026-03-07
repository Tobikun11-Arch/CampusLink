import {apiClient} from '../../../shared/api/client';

type Role = 'NORMAL' | 'OFFICER' | 'PRESIDENT';

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  campus: string;
  role: Role;
  roleProof?: {
    uri: string;
    name: string;
    type: string;
  } | null;
};

export async function register(input: RegisterInput) {
  const form = new FormData();
  form.append('firstName', input.firstName);
  form.append('lastName', input.lastName);
  form.append('email', input.email);
  form.append('password', input.password);
  form.append('campus', input.campus);
  form.append('role', input.role);

  if (input.role === 'OFFICER' || input.role === 'PRESIDENT') {
    if (!input.roleProof) {
      throw new Error('Role proof is required for OFFICER/PRESIDENT');
    }
    form.append('roleProof', {
      uri: input.roleProof.uri,
      name: input.roleProof.name,
      type: input.roleProof.type
    } as any);
  }

  const res = await apiClient.post('/api/auth/register', form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return res.data as {id: string; email: string; verificationCode: string};
}

export async function verify(input: {email: string; code: string}) {
  const res = await apiClient.post('/api/auth/verify', input);
  return res.data as {success: boolean};
}

export async function login(input: {email: string; password: string}) {
  const res = await apiClient.post('/api/auth/login', input);
  return res.data as {accessToken: string; refreshToken: string};
}
