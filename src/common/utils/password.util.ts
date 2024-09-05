// src/common/utils/password.util.ts

import * as bcrypt from 'bcrypt';

// 비밀번호 해싱 유틸리티 함수
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// 비밀번호 비교 유틸리티 함수
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}