FROM node:16-alpine
# < Docker 이미지를 지정하는 명령어 >

# - 'node:16-alpine'은 Node.js 16 버전의 Alpine Linux 기반 경량 이미지를 사용함
#   'alpine' 은 매우 작은 크기의 리눅스 배포판으로, 기본적인 Linux 기능만 포함되어 있어
#   이미지 크기를 줄이는데 유리함.
# - 'node:16' 은 Node.js 16 버전을 사용하겠다는 의미임.
#   이 버전이 애플리케이션과 호환되는지 확인해야 함.




# ***중요***
# < Docker 컨테이너 내부에서 작업할 기본 디렉토리 설정 >

# - 도커 컨테이너 내부에 '/app' 디렉토리를 생성하고, 그 안에서 모든 작업이 이루어지게 설정함.
#   컨테이너 내부에서 명령어를 실행할 기본 디렉토리를 '/app' 디렉토리로 설정하는 것임.
#   여기서는 '/app' 이라는 디렉토리를 생성하고, 그 /app 디렉토리 안에서 명령어가 실행되도록 설정하는 것임.
# - '/app' 디렉토리는 도커 컨테이너 내부에서 이 프로젝트에 대한 루트 디렉토리로, 
#   소스 코드와 관련 파일들이 복사될 곳임.
# - 이는 실제로는 컨테이너 내부에 존재하는 가상 파일 시스템 상의 경로임.
#   컨테이너가 실행되면 작업 디렉토리로 자등올 이동함.
#   이로 인해 추가적인 경로 지정 없이 명령어를 실행할 수 있게 되는 것임.
WORKDIR /app




# < 로컬의 'package.json' 과 'package-lock.json' 파일을 'Docker 컨테이너 내부의 현재 디렉토리 app' 으로 복사함 >

# - 'package.json' 파일과 'package-lock.json' 파일을 복사하는 이유는
#   이 파일들이 프로젝트의 의존성 dependencies 를 정의하기 때문임.
#   즉, 이 프로젝트가 동작하기 위해 어떤 라이브러리들이 필요한지 명시되어 있는 파일들임!!
# - 여기서는'package*.json' 의 와일드카드 패턴을 사용하여, 두 파일을 모두 복사함.
#   즉, '*'를 사용함으로써 'package.json' 과 'package-lock.json'이 모두 함께 복사됨.
#   즉, 'package.json' 은 와일드카드 패턴으로, 'pakcage.json' 과 'pakcage-lock.json' 파일을 모두 복사할 수 있음.
# - 이 단계에서 이 파일들만 먼저 복사하는 이유는 ***캐시 레이어*** 를 활용하기 위함임.
#   Docker 는 이전 빌드의 캐시를 재사용할 수 있도록 하여 빌드 시간을 줄여줌.
#   만약, 소스 코드가 변경되지 않고 의존성도 변경되지 않았다면,
#   이후 npmp install 명령어도 캐시에서 재사용된다!!
COPY package*.json ./




# < 'Docker 컨테이너 내부에서 npm install 을 실행'하여, '바로 윗 단계의 healthcraft 프로젝트에서 가져온 package.json 파일에 명시된
#    모든 의존성들 dependencies' 을 'Docker 컨테이너 내부에 설치'시킴 >

# - 'npm install'은 Node.js 프로젝트에서 의존성 관리를 위해 사용되는 명령어로,
#   'package.json' 파일에 정의된 모든 라이브러리들을 다운로드하여
#   ***'Docker 컨테이너 내부에 node_modules 디렉토리를 생성하여 이 곳에 그 의존성들을 설치함'***.
# - 'npm install'은 네트워크를 통해 외부 레지스트리(NPM 레지스트리)에서 패키지를 다운로드하기 때문에, 빌드 속도에 영향을 줄 수 있음.
#   '캐시 레이어'를 제대로 활용하면, 의존성 설치는 이전에 한 번만 실행되고
#   이후에는 캐시된 결과를 재사용할 수 있음.
# - 'RUN npm install' 은 Docker 컨테이너 내부에서만 실행되고,
#   '로컬 호스트 머신에 있는 node_modules'는 복사되지 않기 때문에, 컨테이너가 독립적으로 동작할 수 있게 만들어줌.
# ******중요******
# - 즉,
#   'COPY package*.json ./'를 통해 Docker 컨테이너 내부로 현재 vscode 프로젝트의 의존성을 가져오고,
#   'RUN npm install'을 통해 그 가져온 현재 vscode 프로젝트의 의존성들을 Docker 컨테이너 내부에서 설치 실행시키는 것임.
# - 'COPY package*.json ./' 과 'RUN npm install' 명령어가
#   아래에 있는 
#   1) '현재 vscode 프로젝트의 모든 소스코드들을 복사하는 명령어 COPY . .' 및
#   2) '복사한 현재 vscode 프로젝트의 모든 소스코드 TypeScript 프로젝트를 Docker 컨테이너 내부에서 빌드하여 JavaScript 파일로 변환, 컴파일하여
#      결과물을 생성해주는 명령어 RUN npm run build' 
#   보다 먼저 실행되도록 해야 하는 이유는
#   '다음 빌드 시 보다 빠른 빌드 시간', '효율적인 캐시 활용', '불필요한 재설치 방지' 를 위함이다!!
# - 패키지 파일 package.json 만 먼저 복사 (캐시 효율성 증가)
#   : - 'COPY package*.json ./' 이 단계에서는 vscode 프로젝트의 소스 코드 전체가 아닌, 
#       'package.json' 파일과 'package-lock.json' 파일만 ---> Docker 컨테이너 내부로 복사됨.
#     - 의존성 설치에 영향을 미치는 파일은 오직 package.json 과 package-lock.json 파일이기 떄문에,
#       이 파일들만 먼저 복사하는 것이 효율적임.
#     - Docker 는 이 두 파일들을 복사한 레이어를 '캐시할 수 있게 됨'.
#       만약 이후 다시 빌드 시, package.json 파일이 변경되지 않았다면, 
#       다음 빌드에서도 이 캐시 레이러를 재사용할 수 있음.
# - 의존성 설치 (캐시를 활용하여 불필요한 재설치를 방지)
#   : - RUN npm install' 이 단계에서는 npm install 을 실행하여, package.json 파일에 명시된 모든 의존성들을
#       'Docker 컨테이너 내부에 설치'함!!!
#     - 이 명령어는 네트워크를 통해 'NPM 레지스트리'에서 패키지를 다운로드하고, 
#       'Docker 컨테이너 내부에 node_modules 디렉토리를 생성하여 의존성을 설치함'.
#     ***중요***
#     - npm run install 명령어는 시간이 많이 소요될 수 있음.
#       만약 이 단계에서 캐시를 사용하지 않고 매번 새로 의존성 package.json 파일을 설치하게 된다면,
#       도커 이미지 빌드 시간이 매우 길어질 수 있음.
#     - 하.지.만! 만약, pakcage.json 파일이 변경되지 않았다면, Docker 는 이전 빌드에서 이미 설치된 의존서을
#       그대로 재사용할 수 있음!
#       이는 이전에 캐시된 RUN nppm install 레이어가 존재하기 때문임!
#     - 만약, package.json 의 내부 코드가 변경되었다면, Docker 는 캐시를 사용하지 않고
#       다시 의존성을 설치하게 된다 당연히.
RUN npm install




# < vscode 에 있는 로컬 프로젝트의 모든 파일들을 --> Docker 컨테이너 내부의 '/app 디렉토리'로 '복사'한다! >

# - '첫 번째 .'
#   : 첫 번째 '.'은 vscode 에 있는 로컬 디렉토리(현재 디렉토리)를 의미함.
# - '두 번재 .'
#   : 두 번재 '.' 은 Docker 컨테이너의 작업 디렉토리(여기서는 '/app 디렉토리')를 의미함.
# - 이 'COPY . .' 명령어는 vscode 로컬에 있는 모든 파일과 그 하위 디렉토리들을 ---> Docker 컨테이너 내부의 '/app 디렉토리'로 복사함.
# - 주의할 점은 '.dockerignore 파일'을 사용하여서 복사하고 싶지 않은 파일(e.g: 'node_modules 파일', '.gist', 'dist')을
#   제외시켜야 함.
#   위와 같은 '불필요한 파일들'이 Docker 컨테이너 내부로 복사되면
#   이미지 크기가 커지고 빌드 시간이 오래 걸릴 수 있음.
# ******중요*******
# - '현재 vscode 프로젝트의 전체 소스 코드를 Docker 컨테이너 내부로 복사하는 COPY . . 명령어' 및
#   '복사한 현재 vscode 프로젝트의 모든 소스코드 TypeScript 프로젝트를 Docker 컨테이너 내부에서 빌드하여 JavaScript 파일로 변환, 컴파일하여
#   결과물을 생성해주는 명령어 RUN npm run build' 를 
#   'COPY package*.json ./' 및 'RUN npm install' 이후에 작성하는 이유는,
#   만약, 'COPY package*.json ./' 및 'RUN npm install' 보다 이전에 작성한다면
#   소스 코드에 변경이 있어서 Docker 를 다시 빌드할 때마다 
#   'Docker 컨테이너 내부에 현재 vscode 프로젝트의 의존성을 설치하는 npm install'도 다시 실행되어야 했을 것임.
#   ***이는 불필요한 재설치를 야기하게 되어 '빌드 시간을 크게 증가시킴!!'***
# - 로컬 vscode 프로젝트의 소스 코드는 '의존성 설치와 무관'하므로, 
#   이를 '의존성 설치 단계 이후에 수행'하면 'npm install'을 반복 실행할 필요가 없게 되는 것이다!!
#   즉, 이 전략은 RUN npm install 이 '소스 코드 변경에 영향을 받지 않도록 함'으로써,
#   '불필요한 npm install 반복 재설치를 방지'하여 'Docker 이미지 재빌드 시간을 크게 단축'시키는 것이다!!

# 예시 시나리오:

# 상황 1: 소스 코드만 약간 변경됨 (예: 새로운 기능 추가)
# package.json 파일이 변경되지 않기 때문에, Docker는 COPY package*.json → **RUN npm install**에서 캐시를 재사용합니다. 
# npm install은 실행되지 않고, 이미 설치된 의존성을 그대로 유지합니다.
# 결과적으로, 소스 코드 복사와 빌드 과정만 새로 진행되므로, 빌드 시간이 매우 짧아집니다.


# 상황 2: 새로운 패키지가 추가됨 (예: package.json 수정)
# package.json 파일이 변경되었기 때문에 Docker는 캐시를 사용하지 않고, npm install을 다시 실행하여 새로운 패키지를 설치합니다. 
# 이때만 npm install이 재실행됩니다.
# 이후에는 새로 변경된 의존성을 포함한 컨테이너가 생성됩니다.
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]




