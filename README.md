## 목차
1. [프로그램 주요 기능 (Main Features)](#프로그램-주요-기능-main-features)
   - [회원가입 (Sign Up)](#회원가입-sign-up)
   - [로그인 (Sign In)](#로그인-sign-in)
   - [비밀번호 찾기 및 재설정 (Reset Password)](#비밀번호-찾기-및-재설정-reset-password)
   - [아이디 찾기 (Find ID)](#아이디-찾기-find-id)
   - [개인 건강 프로필 관리 (Personal Health Profile Management)](#개인-건강-프로필-관리-personal-health-profile-management)
   - [건강 보고서 생성 (Health Report Generation)](#건강-보고서-생성-health-report-generation)
   - [영양 목표 설정 및 영양제 추천 (Nutrition Goal Setting & Supplement Recommendations)](#영양-목표-설정-및-영양제-추천-nutrition-goal-setting--supplement-recommendations)
   - [식단 계획 및 영양 분석 (Meal Planning & Nutrition Analysis)](#식단-계획-및-영양-분석-meal-planning--nutrition-analysis)
2. [사용 기술 스택 및 라이브러리 (Tech Stack & Libraries)](#사용-기술-스택-및-라이브러리-tech-stack--libraries)
3. [API specifications](#api-specifications)
4. [ERD 데이터 모델링 (ERD Data Modeling)](#erd-데이터-모델링-erd-data-modeling)

<br>

## 프로그램 주요 기능 (Main Features)

### 회원가입 (Sign Up)
- [ ] 이메일, 비밀번호, 이름, 생년월일, 성별 등의 기본 정보를 입력하여 계정 생성
- [ ] 이메일 중복 확인 및 비밀번호 강도 검증 기능 구현
- [ ] 회원가입 시 JWT 토큰 생성 및 반환

### 로그인 (Sign In)
- [ ] 이메일(또는 사용자 이름)과 비밀번호를 사용한 로그인 시스템
- [ ] JWT(JSON Web Token)를 이용한 사용자 인증 구현
- [ ] 로그인 상태 유지 기능 제공

### 비밀번호 찾기 및 재설정 (Reset Password)
- [ ] 등록된 이메일로 비밀번호 재설정 링크 발송
- [ ] 보안을 위한 일회용 토큰 생성 및 유효 시간 설정(1 시간)
- [ ] 새 비밀번호 설정 시 최소 길이 검증

### 아이디 찾기 (Find ID)
- [ ] 등록된 이메일 주소를 이용한 사용자 이름(ID) 찾기 기능

### 개인 건강 프로필 관리 (Personal Health Profile Management)
- [ ] 키, 체중 등 기본 신체 정보 입력 및 업데이트
- [ ] BMI 자동 계산 기능
- [ ] 활동 수준 및 건강 목표 설정

### 건강 보고서 생성 (Health Report Generation)
- [ ] 사용자의 최근 건강 검진 결과를 바탕으로 건강 보고서 생성
- [ ] 전반적 건강 상태 및 주요 건강 지표 평가 포함

### 영양 목표 설정 및 영양제 추천 (Nutrition Goal Setting & Supplement Recommendations)
- [ ] 사용자의 건강 프로필을 바탕으로 일일 영양 목표 설정
- [ ] 칼로리, 단백질, 탄수화물, 지방의 목표 섭취량 설정
- [ ] 건강 프로필과 영양 섭취 분석을 바탕으로 개인화된 영양제 추천

<br>

## 사용 기술 스택 및 라이브러리 (Tech Stack & Libraries)
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

<br>

## API specifications
![image](https://github.com/user-attachments/assets/eb9a7182-c602-438d-ba74-f1e780a90528)

<br>

## ERD 데이터 모델링 (ERD Data Modeling)
![image](https://github.com/user-attachments/assets/774d78d8-3156-4d5e-b46e-a5cde600f9b5)
