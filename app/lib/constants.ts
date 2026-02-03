// 환경에 따른 basePath 설정
// GitHub Pages 배포 시에만 /animation_test 사용 (저장소 이름과 일치)
export const BASE_PATH = process.env.NODE_ENV === 'production' ? '/animation_test' : '';

// 경로에 basePath를 추가하는 유틸리티 함수
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
