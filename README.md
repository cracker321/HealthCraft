## 목차

1. [프로그램 주요 기능&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Main Features](#프로그램-주요-기능-main-features)
   - [회원가입&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sign Up](#회원가입-sign-up)
   - [로그인&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sign In](#로그인-sign-in)
   - [비밀번호 찾기 및 재설정&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Reset Password](#비밀번호-찾기-및-재설정-reset-password)
   - [개인 건강 프로필 관리&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Personal Health Profile Management](#개인-건강-프로필-관리-personal-health-profile-management)
   - [영양 목표 설정 및 추적&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nutrition Goal Setting & Tracking](#영양-목표-설정-및-추적-nutrition-goal-setting--tracking)
   - [식단 계획 및 레시피 추천&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Meal Planning & Recipe Recommendations](#식단-계획-및-레시피-추천-meal-planning--recipe-recommendations)
   - [건강 검진 기록&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Health Check-up Records](#건강-검진-기록-health-check-up-records)
   - [영양제 추천&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Supplement Recommendations](#영양제-추천-supplement-recommendations)

2. [사용한 기술 스택 및 라이브러리&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tech Stack & Libraries](#사용한-기술-스택-및-라이브러리-tech-stack-libraries)
3. [ERD 데이터 모델링&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERD Data Modeling](#erd-데이터-모델링-erd-data-modeling)

<br/><br/>

## 프로그램 주요 기능 (Main Features)

### 회원가입 (Sign Up)

- [ ] 이메일, 비밀번호, 이름, 생년월일, 성별 등의 기본 정보를 입력하여 계정 생성
- [ ] 이메일 중복 확인 및 비밀번호 강도 검증 기능 구현
- [ ] 회원가입 시 초기 건강 프로필 설정 안내

### 로그인 (Sign In)

- [ ] 이메일과 비밀번호를 사용한 안전한 로그인 시스템
- [ ] JWT(JSON Web Token)를 이용한 사용자 인증 구현
- [ ] 로그인 상태 유지 기능 제공

### 비밀번호 찾기 및 재설정 (Reset Password)

- [ ] 등록된 이메일로 비밀번호 재설정 링크 발송
- [ ] 보안을 위한 일회용 토큰 생성 및 유효 시간 설정
- [ ] 새 비밀번호 설정 시 강도 검증 및 이전 비밀번호와의 중복 확인

### 개인 건강 프로필 관리 (Personal Health Profile Management)

- [ ] 키, 체중, 체지방률 등 기본 신체 정보 입력 및 업데이트
- [ ] 식이 제한사항, 알레르기 정보 등록
- [ ] 건강 목표 설정 (체중 감량, 근육 증가, 전반적인 건강 개선 등)
- [ ] 활동 수준 및 일일 운동량 기록

### 영양 목표 설정 및 추적 (Nutrition Goal Setting & Tracking)

- [ ] 사용자의 신체 정보와 활동 수준을 바탕으로 일일 권장 칼로리 계산
- [ ] 탄수화물, 단백질, 지방의 적정 비율 제안
- [ ] 영양소별 섭취 목표 설정 및 일일/주간 달성율 시각화
- [ ] 영양 불균형 알림 및 개선 제안

### 식단 계획 및 레시피 추천 (Meal Planning & Recipe Recommendations)

- [ ] 개인 영양 목표에 맞는 일일/주간 식단 자동 생성
- [ ] 식이 제한사항과 선호도를 고려한 레시피 추천
- [ ] 식품 데이터베이스를 활용한 영양성분 자동 계산
- [ ] 사용자 피드백을 반영한 레시피 추천 알고리즘 개선

### 건강 검진 기록 (Health Check-up Records)

- [ ] 정기 건강 검진 결과 입력 및 관리 (혈압, 콜레스테롤, 혈당 등)
- [ ] 시간에 따른 건강 지표 변화 그래프 제공
- [ ] 이상 수치 감지 및 개선을 위한 조언 제공
- [ ] 다음 검진 일정 알림 기능

### 영양제 추천 (Supplement Recommendations)

- [ ] 건강 프로필과 영양 섭취 분석을 바탕으로 개인화된 영양제 추천
- [ ] 영양제 복용 일정 관리 및 알림 기능
- [ ] 영양제와 약물 간의 상호작용 정보 제공
- [ ] 정기적인 효과 평가 및 추천 조정

<br/><br/>

## 사용한 기술 스택 및 라이브러리 (Tech Stack & Libraries)

<p align="center">
  <img src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" alt="TypeScript" width="100" height="100"/>
  <img src="https://docs.nestjs.com/assets/logo-small.svg" alt="NestJS" width="100" height="100"/>
  <img src="https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg" alt="MySQL" width="100" height="100"/>
  <img src="https://avatars.githubusercontent.com/u/20165699?s=200&v=4" alt="TypeORM" width="100" height="100"/>
  <img src="https://jwt.io/img/pic_logo.svg" alt="JWT" width="100" height="100"/>
  <img src="https://static1.smartbear.co/swagger/media/assets/swagger_fav.png" alt="Swagger" width="100" height="100"/>
</p>

- Backend: TypeScript, Nest.js
- Database: MySQL
- ORM: TypeORM
- Authentication: JWT
- API Documentation: Swagger

<br/><br/>

## ERD 데이터 모델링 (ERD Data Modeling)

![image](https://github.com/user-attachments/assets/5ea0bd15-b97f-4699-b2c8-0ddc0b815a0c)
