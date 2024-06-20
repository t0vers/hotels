interface IEnvironment {
    apiUsersUrl: string;
    apiCatalogUrl: string;
    apiAdminUrl: string;
}

export const environment: IEnvironment = {
    apiUsersUrl: 'http://localhost:8000',
    apiCatalogUrl: 'http://localhost:8001',
    apiAdminUrl: 'http://localhost:8002'
}
