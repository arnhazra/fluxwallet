export enum AppEventMap {
  // General Events
  SendEmail = "sendEmail",
  CreateAnalytics = "createAnalytics",
  GetUserDetails = "getUserDetails",
  // WealthAnalyzer Events
  CreateSpace = "createSpace",
  GetSpaceList = "getSpaceList",
  GetTotalWealth = "getTotalWealth",
  FindAssetById = "findAssetbyId",
  UpdateAssetById = "updateAssetById",
  GetAssetList = "getAssetList",
  // DebtTrack Events
  CreateDebt = "createDebt",
  GetTotalDebt = "getTotalDebt",
  GetDebtList = "getDebtList",
  // WealthGoal Events
  CreateGoal = "createGoal",
  GetGoalList = "getGoalList",
  GetNearestGoal = "getNearestGoal",
  // ExpenseTrack Events
  GetExpenseByMonth = "getExpenseByMonth",
  CreateExpense = "createExpense",
  //CashFlow Events
  FindCashFlowsByUserId = "findCashFlowsByUserId",
}
