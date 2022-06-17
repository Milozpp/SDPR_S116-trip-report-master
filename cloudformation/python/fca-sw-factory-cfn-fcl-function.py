import os
import troposphere
from troposphere import (
    Parameter,
    FindInMap,
    Ref,
    Join,
    Sub,
    GetAtt,
)
from troposphere.awslambda import (
    VPCConfig,
)
from troposphere_helpers import *
from troposphere.serverless import Function
from troposphere.awslambda import Environment as LambdaEnvironment
from troposphere.awslambda import Permission as LambdaPermission
from troposphere.iam import Role, ManagedPolicy
from troposphere.dynamodb import AttributeDefinition, KeySchema
from component_info import *
from policies import (
  global_policy_document,
  assume_role_policy_document
)
import version

# 1. Template definition
# 1.1. Descriptions
description = version.DESCRIPTION
short_description = version.SHORT_DESCRIPTION
template = troposphere.Template(
    Description=f'FCA SW Factory - Connectivity Project - Function Template - Description: {description}')

# 1.2. Transformation
template.set_transform('AWS::Serverless-2016-10-31')

# 1.3. Parameters
parameters = dict()
parameters['env'] = Parameter(
    '0001ParamEnvironment',
    Type='String',
    AllowedValues=['dev', 'int', 'qual', 'prep', 'prod'],
    ConstraintDescription='One value of [\'dev\', \'int\',\'qual\', \'prep\', \'prod\']',
    Description='Name of the Environment')
parameters['project_name'] = Parameter(
    '0002ParamProjectName',
    Type='String',
    Default=base_info['Project Name'],
    Description='Name of the Project')
parameters['project_component'] = Parameter(
    '0003ParamProjectComponent',
    Type='String',
    Default=base_info['Project Component'],
    Description='Name of the Component')
parameters['feature_name'] = Parameter(
    '0004ParamFeatureName',
    Type='String',
    Default=base_info['Feature Name'],
    Description='Name of the Feature')
parameters['feature_code'] = Parameter(
    '0005ParamFeatureCode',
    Type='String',
    Default=base_info['Feature Code'],
    Description='Feature Code for this feature')
parameters['lambda_tracer_layer_arn'] = Parameter(
    '0006ParamLambdaTracerLayer',
    Type='String',
    Description='Lambda layer to attach to the lambda functions')
parameters['version'] = Parameter(
    '0007ParamVersion',
    Type='String',
    Description='Git code version')
parameters['telematics_api_id'] = Parameter(
    '0201ParamTelematicsApiID',
    Type='String',
    Description='Existing API used by Web and Mobile App where new Schedule resource is added')
parameters['telematics_api_account_id'] = Parameter(
    '0202ParamTelematicsAPIAccountID',
    Type='String',
    Description='AWS Account id in which the applicative api is deployed')
parameters['multichannels_api_id'] = Parameter(
    '0203ParamMultichannelsApiID',
    Type='String',
    Description='Existing API used by Web and Mobile App where new Schedule resource is added')
parameters['multichannels_api_account_id'] = Parameter(
    '0204ParamMultichannelsAPIAccountID',
    Type='String',
    Description='AWS Account id for cross account permission')
parameters['dynamodb_kms_key_arn'] = Parameter(
    '0205ParamDynamoDbKmsKeyArn',
    Type='String',
    Description='AWS DynamoDb managed key arn')
parameters['subnet_id_list_lambda'] = Parameter(
    '0301ParamLambdaSubnetIdList',
    Type='List<AWS::EC2::Subnet::Id>',
    Description='Comma Separated List of VPC Subnets in the above VPC for Lambda functions')
parameters['securitygroup_id_list_lambda'] = Parameter(
    '0302ParamLambdaSecuritygroupIdList',
    Type='List<AWS::EC2::SecurityGroup::Id>',
    Description='Comma Separated List of VPC security group ID in the above VPC for Lambda functions')
parameters['ignite_host'] = Parameter(
    '0401ParamIgniteApiHost',
    Type='String',
    Description='Base url for IGNITE apis')
parameters['events_data_stream'] = Parameter(
    '0402ParamEventDataStream',
    Type='String',
    Description='Name of the Kinesis Data Stream where events are sent')

# 1.3.X Add all created parameters in template
for parameter in parameters.values():
    template.add_parameter(parameter)

# 1.4. Mapping
mappings = dict()

# 1.4. Mapping
mappings = {}
mappings['EnvRegionIndexMap'] = {
    aws_region: {
        environment: f'{environment}-{aws_region}'
        for environment in available_environments
    }
    for aws_region in available_aws_regions
}
mappings['EnvRegionMap'] = {
    'dev-eu-west-1': {
        'logLevel': 'debug'
    },
    'int-eu-west-1': {
        'logLevel': 'debug'
    },
    'prep-eu-west-1': {
        'logLevel': 'info'
    },
    'prod-eu-west-1': {
        'logLevel': 'error'
    },
    'dev-us-east-1': {
        'logLevel': 'debug'
    },
    'int-us-east-1': {
        'logLevel': 'debug'
    },
    'prep-us-east-1': {
        'logLevel': 'info'
    },
    'prod-us-east-1': {
        'logLevel': 'error'
    }
}

# create utils object
utils = Utils(Ref(parameters['env']))

# add default lambda configuration (memory and timeout) to mapping
#utils.default_lambda_configuration(trip_report_status_lambda_function_info, mappings)
utils.default_lambda_configuration(trip_report_settings_lambda_function_info, mappings)
utils.default_lambda_configuration(trip_report_details_lambda_function_info, mappings)
utils.default_lambda_configuration(trip_report_summary_lambda_function_info, mappings)

# add default dynamo configuration (WCU, RCU and autoscaling parameters) to mapping
utils.default_dynamo_configuration(gcv_last_trip_report, mappings)

# 1.4.X Add all created mappings in template
for mapping_name, mapping in mappings.items():
    template.add_mapping(mapping_name, mapping)

# 1.5. Resources
resources = dict()

tags = base_info
tags['AWS Region'] = Ref(troposphere.AWS_REGION)
tags['Environment'] = Ref(parameters['env'])
tags['Project Name'] = Ref(parameters['project_name'])
tags['Project Component'] = Ref(parameters['project_component'])
tags['Feature Name'] = Ref(parameters['feature_name'])
tags['Feature Code'] = Ref(parameters['feature_code'])
tags['Git Version'] = Ref(parameters['version'])

base_name = Join('_', [
    Ref(parameters['project_component']),
    Ref(parameters['feature_code']),
    Ref(parameters['env']),
    Ref(troposphere.AWS_REGION)
])

# 1.5.1 Lambda Execution Role
resources[global_policy_for_lambda_function_execution_iam_policy_info.template_logical_id] = ManagedPolicy(
    global_policy_for_lambda_function_execution_iam_policy_info.template_logical_id,
    ManagedPolicyName=Join('', [base_name, '_{code}-global-policy'.format(
        code=global_policy_for_lambda_function_execution_iam_policy_info.code)]),
    Description='This policy contains all permissions written in inline policy named '
                '"gcv-d-sdpr-lmb-ro-send-command-policypermissions" attached to role created by TCS named '
                '"gcv-lambda-RO-role"',
    PolicyDocument=global_policy_document
)

resources[specific_policy_for_lambda_function_execution_iam_policy_info.template_logical_id] = ManagedPolicy(
    specific_policy_for_lambda_function_execution_iam_policy_info.template_logical_id,
    ManagedPolicyName=Join('', [base_name, '_{code}-specific-policy'.format(
        code=specific_policy_for_lambda_function_execution_iam_policy_info.code)]),
    Description='This policy contains all specific permissions needed to lambda of Trip Report',
    PolicyDocument={
        'Version': '2012-10-17',
        'Statement': [
            {
                'Sid': 'GetSecret',
                'Effect': 'Allow',
                'Action': [
                    'secretsmanager:GetSecretValue'
                ],
                'Resource': [
                    {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:GCV_TOMTOM*'}
                ]
            }
        ]
    }
)

resources[lambda_function_execution_role_iam_role_info.template_logical_id] = Role(
    lambda_function_execution_role_iam_role_info.template_logical_id,
    RoleName=Join('', [base_name, '_{code}-role-for-lambda-functions'.format(
        code=lambda_function_execution_role_iam_role_info.code)]),
    AssumeRolePolicyDocument=assume_role_policy_document,
    Path='/',
    ManagedPolicyArns=[
        Ref(resources[global_policy_for_lambda_function_execution_iam_policy_info.template_logical_id]),
        Ref(resources[specific_policy_for_lambda_function_execution_iam_policy_info.template_logical_id])
    ],
)

# 1.5.2 Global VPC Config
global_lambda_vpc_config = VPCConfig(
    SecurityGroupIds=Ref(parameters['securitygroup_id_list_lambda']),
    SubnetIds=Ref(parameters['subnet_id_list_lambda'])
)

# 1.5.3 TripReportStatus Lambda
# resources[trip_report_status_lambda_function_info.template_logical_id] = Function(
#     trip_report_status_lambda_function_info.template_logical_id,
#     FunctionName=trip_report_status_lambda_function_info.generate_function_name(
#         base_name, 'trip-report-status'),
#     CodeUri='../../src/lambdas/TripReportStatus/dist',
#     Handler='src/handler.handler',
#     Runtime=DEFAULT_NODE_RUNTIME,
#     Layers=[Ref(parameters['lambda_tracer_layer_arn'])],
#     AutoPublishAlias='gsdp',
#     Description=f'Function able to: {short_description}',
#     MemorySize=utils.get_value_from_env_region_map_by_key(
#         f'{trip_report_status_lambda_function_info.template_logical_id}Memory'),
#     Timeout=utils.get_value_from_env_region_map_by_key(
#         f'{trip_report_status_lambda_function_info.template_logical_id}Timeout'),
#     Environment=LambdaEnvironment(
#         Variables={
#             'stage': Ref(parameters['env']),
#             'logLevel': utils.get_value_from_env_region_map_by_key('logLevel'),
#             'TARGET_KINESIS_DATA_STREAM': Ref(parameters['events_data_stream']),
#             'IGNITE_HOST': Ref(parameters['ignite_host'])
#         }
#     ),
#     Role=GetAtt(
#         resources[lambda_function_execution_role_iam_role_info.template_logical_id], 'Arn'),
#     Tags=tags,
#     VpcConfig=global_lambda_vpc_config,
# )

# resources[trip_report_status_lambda_permission_info.template_logical_id] = trip_report_status_lambda_function_info.generate_lambda_permission(
#     resources,
#     trip_report_status_lambda_permission_info,
#     Ref(parameters['telematics_api_account_id']),
#     Ref(parameters['telematics_api_id']))

# 1.5.4 TripReportSettings Lambda
resources[trip_report_settings_lambda_function_info.template_logical_id] = Function(
    trip_report_settings_lambda_function_info.template_logical_id,
    FunctionName=trip_report_settings_lambda_function_info.generate_function_name(
        base_name, 'trip-report-settings'),
    CodeUri="../../src/lambdas/TripReportSettings/dist",
    Handler='src/handler.handler',
    Runtime=DEFAULT_NODE_RUNTIME,
    Layers=[Ref(parameters['lambda_tracer_layer_arn'])],
    AutoPublishAlias="gsdp",
    Description="API used to process the revoke authorization"
                "- version:{}".format(short_description),
    MemorySize=utils.get_value_from_env_region_map_by_key(
        f'{trip_report_settings_lambda_function_info.template_logical_id}Memory'),
    Timeout=utils.get_value_from_env_region_map_by_key(
        f'{trip_report_settings_lambda_function_info.template_logical_id}Timeout'),
    Environment=LambdaEnvironment(
        Variables={
            'stage': Ref(parameters['env']),
            'logLevel': utils.get_value_from_env_region_map_by_key('logLevel'),
            'IGNITE_HOST': Ref(parameters['ignite_host'])
        }
    ),
    Role=GetAtt(
        resources[lambda_function_execution_role_iam_role_info.template_logical_id], "Arn"),
    Tags=tags,
    VpcConfig=global_lambda_vpc_config,
)

resources[trip_report_settings_lambda_permission_info.template_logical_id] = trip_report_settings_lambda_function_info.generate_lambda_permission(
    resources,
    trip_report_settings_lambda_permission_info,
    Ref(parameters['multichannels_api_account_id']),
    Ref(parameters['multichannels_api_id']))


# 1.5.5 TripReportDetails Lambda
resources[trip_report_details_lambda_function_info.template_logical_id] = Function(
    trip_report_details_lambda_function_info.template_logical_id,
    FunctionName=trip_report_details_lambda_function_info.generate_function_name(
        base_name, 'trip-report-details'),
    CodeUri='../../src/lambdas/TripReportDetails/dist',
    Handler='src/handler.handler',
    Runtime=DEFAULT_NODE_RUNTIME,
    Layers=[Ref(parameters['lambda_tracer_layer_arn'])],
    AutoPublishAlias='gsdp',
    Description=f'Function able to: {short_description}',
    MemorySize=utils.get_value_from_env_region_map_by_key(
        f'{trip_report_details_lambda_function_info.template_logical_id}Memory'),
    Timeout=utils.get_value_from_env_region_map_by_key(
        f'{trip_report_details_lambda_function_info.template_logical_id}Timeout'),
    Environment=LambdaEnvironment(
        Variables={
            'stage': Ref(parameters['env']),
            'logLevel': utils.get_value_from_env_region_map_by_key('logLevel'),
            'TARGET_KINESIS_DATA_STREAM': Ref(parameters['events_data_stream']),
            'IGNITE_HOST': Ref(parameters['ignite_host'])
        }
    ),
    Role=GetAtt(
        resources[lambda_function_execution_role_iam_role_info.template_logical_id], 'Arn'),
    Tags=tags,
    VpcConfig=global_lambda_vpc_config,
)

resources[trip_report_details_lambda_permission_info.template_logical_id] = trip_report_details_lambda_function_info.generate_lambda_permission(
    resources,
    trip_report_details_lambda_permission_info,
    Ref(parameters['multichannels_api_account_id']),
    Ref(parameters['multichannels_api_id']))

# 1.5.6 TripReportSummary Lambda
resources[trip_report_summary_lambda_function_info.template_logical_id] = Function(
    trip_report_summary_lambda_function_info.template_logical_id,
    FunctionName=trip_report_summary_lambda_function_info.generate_function_name(
        base_name, 'trip-report-summary'),
    CodeUri="../../src/lambdas/GetTripSummaryDetails/dist",
    Handler='src/handler.handler',
    Runtime=DEFAULT_NODE_RUNTIME,
    Layers=[Ref(parameters['lambda_tracer_layer_arn'])],
    AutoPublishAlias="gsdp",
    Description="API used to process the revoke authorization"
                "- version:{}".format(short_description),
    MemorySize=utils.get_value_from_env_region_map_by_key(
        f'{trip_report_summary_lambda_function_info.template_logical_id}Memory'),
    Timeout=utils.get_value_from_env_region_map_by_key(
        f'{trip_report_summary_lambda_function_info.template_logical_id}Timeout'),
    Environment=LambdaEnvironment(
        Variables={
            'stage': Ref(parameters['env']),
            'logLevel': utils.get_value_from_env_region_map_by_key('logLevel'),
            'IGNITE_HOST': Ref(parameters['ignite_host'])
        }
    ),
    Role=GetAtt(
        resources[lambda_function_execution_role_iam_role_info.template_logical_id], "Arn"),
    Tags=tags,
    VpcConfig=global_lambda_vpc_config,
)

resources[trip_report_summary_lambda_permission_info.template_logical_id] = trip_report_summary_lambda_function_info.generate_lambda_permission(
    resources,
    trip_report_summary_lambda_permission_info,
    Ref(parameters['multichannels_api_account_id']),
    Ref(parameters['multichannels_api_id']))

# 1.5.7 Last Trip Report Dynamo Table

# attribute definition and key schema for dynamo table
gcv_last_trip_report_table_attribute_definitions = [
    AttributeDefinition(AttributeName='userVin', AttributeType='S'),
]
gcv_last_trip_report_table_key_schema = [
    KeySchema(AttributeName='userVin', KeyType='HASH')
]

# dynamo table object creation
gcv_last_trip_report_table = DynamoTable(
    template,
    resources,
    gcv_last_trip_report.template_logical_id,
    'GCV_LAST_TRIP_REPORT')

# dynamo table generation
gcv_last_trip_report_table.generateDynamoTable(utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}WCU'),
                                              utils.get_value_from_env_region_map_by_key(
                                                  f'{gcv_last_trip_report.template_logical_id}RCU'),
                                              gcv_last_trip_report_table_attribute_definitions,
                                              gcv_last_trip_report_table_key_schema,
                                              Ref(parameters['dynamodb_kms_key_arn']))

# dynamodb autoscaling policies generation
gcv_last_trip_report_table.generateAutoscalingPolicy(
    'READ',
    utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}ReadScaleEnabled'),
    utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}MinCapacity'), 
    utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}MaxCapacity'), 
    utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}TargetValue'), 
    utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}ScaleInCooldown'), 
    utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}ScaleOutCooldown'))

gcv_last_trip_report_table.generateAutoscalingPolicy(
    'WRITE',
    utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}WriteScaleEnabled'),
    utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}MinCapacity'), 
    utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}MaxCapacity'), 
    utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}TargetValue'), 
    utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}ScaleInCooldown'), 
    utils.get_value_from_env_region_map_by_key(f'{gcv_last_trip_report.template_logical_id}ScaleOutCooldown'))

# 1.5.X Add all created resources in template
for resource in resources.values():
    template.add_resource(resource)

# 2. Template compiling
template_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    os.pardir,
    'template',
    'infrastructure-FCL.yaml')
with open(template_path, 'w+') as f:
    f.write(template.to_yaml())
print(f'Template available at:{template_path}')
