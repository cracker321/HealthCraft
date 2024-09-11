// 비밀번호 해시화 예시 스크립트
import * as bcrypt from 'bcrypt';

async function updatePassword() {
  const plainPassword = 'rldk3106c!';
  const saltOrRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltOrRounds);

  // 이 해시된 비밀번호를 데이터베이스에 수동으로 업데이트해야 합니다.
  console.log(hashedPassword); // 해시된 비밀번호 출력
}

updatePassword();
