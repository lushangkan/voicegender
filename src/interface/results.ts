export interface ModelResults {
    XGBOOST: ModelResult,
    GBT: ModelResult,
    CART: ModelResult,
    RF: ModelResult,
}

export interface ModelResult {
    FEMININE: number,
    MASCULINE: number,
}

