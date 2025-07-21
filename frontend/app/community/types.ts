export interface PostListDto {
    id : number;
    title: string;
    likes: number;
    views: number;
    createdAt: string;  // ISO 문자열로 내려옵니다
    userId: number;
    regionId: number;
}