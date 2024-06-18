interface IEnvironment {
    apiUsersUrl: string;
    apiCatalogUrl: string;
}

export const environment: IEnvironment = {
    apiUsersUrl: 'http://localhost:8000',
    apiCatalogUrl: 'http://localhost:8001'
}
