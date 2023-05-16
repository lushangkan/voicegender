import type {ModelDetails} from "@/script/interface/model-details";

export const modelTypes: Record<string, ModelDetails> = {
    XGBOOST: {
        abb: "XGBOOST",
        fullName: "Extreme Gradient Boosting",
        cnFullName: "极端梯度提升",
    },
    GBT: {
        abb: "GBT",
        fullName: "Gradient Boosted Trees",
        cnFullName: "梯度提升回归树",
    },
    CART: {
        abb: "CART",
        fullName: "Classification and Regression Trees",
        cnFullName: "分类回归树",
    },
    RF: {
        abb: "RF",
        fullName: "Random Forest",
        cnFullName: "随机森林",
    }
}