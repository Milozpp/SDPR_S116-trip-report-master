from troposphere_helpers import ResourceInfo, LambdaFunctionInfo

# BASE INFO: base_info contains information related to entire stack
base_info = {
    'Feature Name': 'trip-report',
    'Feature Code': 'S116',
    'Project Name': 'GSDP',
    'Project Component': 'SDPR',
    'Company': 'FCA-EMEA',
    'Owner': 'SOFTWARE-FACTORY-TEAM',
    'Type': 'Feature',
    'Business Unit': 'MOPAR and Connected Vehicle Program',
    'Category': 'Application',
    'Cloud Provider': 'AWS-FCA',
}


# RESOURCES INFO: here are reported in standard format information related to single resources
# FCL Functions
# trip_report_status_lambda_function_info = LambdaFunctionInfo(
#     code='SC001',
#     name='TripReportStatus'
# )
trip_report_settings_lambda_function_info = LambdaFunctionInfo(
    code='SC002',
    name='TripReportSettings'
)
trip_report_details_lambda_function_info = LambdaFunctionInfo(
    code='SC003',
    name='TripReportDetails'
)
trip_report_summary_lambda_function_info = LambdaFunctionInfo(
    code='SC004',
    name='TripReportSummary'
)

# Lambda Permissions
#trip_report_status_lambda_permission_info = trip_report_status_lambda_function_info.generate_api_gateway_permission_info()
trip_report_settings_lambda_permission_info = trip_report_settings_lambda_function_info.generate_api_gateway_permission_info()
trip_report_details_lambda_permission_info = trip_report_details_lambda_function_info.generate_api_gateway_permission_info()
trip_report_details_lambda_cross_account_permission_info = trip_report_details_lambda_function_info.generate_api_gateway_cross_account_permission_info()
trip_report_summary_lambda_permission_info = trip_report_summary_lambda_function_info.generate_api_gateway_permission_info()

# IAM
global_policy_for_lambda_function_execution_iam_policy_info = ResourceInfo(
    code='SC001',
    template_logical_id='IamPolicySC001GlobalPolicyForLambdaFunctionExecution',
)

# Specific Policy for lambda
specific_policy_for_lambda_function_execution_iam_policy_info = ResourceInfo(
    code='SC001',
    template_logical_id='IamPolicySC002SpecifcPolicyForLambdaFunctionExecution',
)

assume_fcl_role_policy = ResourceInfo(
    code='SC002',
    template_logical_id='IamPolicySC002SpecifcPolicyForFclAssumeRole',
)

cross_account_policy_for_lambda_function_info = ResourceInfo(
    code='SC003',
    template_logical_id='IamPolicySC003CrossAccountPolicyForLambdaFunction',    
)

# Roles
lambda_function_execution_role_iam_role_info = ResourceInfo(
    code='SC001',
    template_logical_id='IamRoleSC001RoleForLambdaFunctionExecution',
)

# Dynamo table
gcv_last_trip_report = ResourceInfo(
    code='SC001',
    template_logical_id='GcvLastTripReportSC001'
)

# Extra infos
available_environments = [
    'dev',
    'int',
    'prep',
    'prod',
]
available_aws_regions = [
    'eu-west-1',
    'us-east-1'
]