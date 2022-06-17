###############################################################################################
## This file will contain all the policies document used inside the throphosphere's scripts  ##
###############################################################################################

global_policy_document = {
      'Version': '2012-10-17',
      'Statement': [
        {
          'Sid': 'APIGatewayGeneric',
          'Effect': 'Allow',
          'Action': [
            'apigateway:GET',
            'apigateway:PATCH',
            'apigateway:POST',
            'apigateway:PUT'
          ],
          'Resource': '*'
        },
        {
          'Sid': 'APIGatewaySpecific',
          'Effect': 'Allow',
          'Action': [
            'execute-api:InvalidateCache',
            'execute-api:Invoke'
          ],
          'Resource': [
            {'Fn::Sub': 'arn:aws:execute-api:${AWS::Region}:${AWS::AccountId}:*/*/*/*'},
          ]
        },
        {
          'Sid': 'DynamoDBSpecific',
          'Effect': 'Allow',
          'Action': [
            'dynamodb:BatchGetItem',
            'dynamodb:BatchWriteItem',
            'dynamodb:DeleteItem',
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:UpdateItem'
          ],
          'Resource': [
            {'Fn::Sub': 'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/CVP*'},
            {'Fn::Sub': 'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/GCV*'},
            {'Fn::Sub': 'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/TERMS_CONDS_AUDIT'},
          ]
        },
        {
          'Sid': 'EC2Generic',
          'Effect': 'Allow',
          'Action': [
            'ec2:CreateNetworkInterface',
            'ec2:DeleteNetworkInterface',
            'ec2:DescribeNetworkInterfaces'
          ],
          'Resource': '*'
        },
        {
          'Sid': 'ElastiCacheGeneric',
          'Effect': 'Allow',
          'Action': [
            'elasticache:Describe*',
            'elasticache:ListAllowedNodeTypeModifications',
            'elasticache:ListTagsForResource'
          ],
          'Resource': '*'
        },
        {
          'Sid': 'IoTGeneric',
          'Effect': 'Allow',
          'Action': [
            'iot:AttachPolicy',
            'iot:AttachPrincipalPolicy',
            'iot:Connect',
            'iot:CreatePolicy',
            'iot:CreatePolicyVersion',
            'iot:CreateThing',
            'iot:DeletePolicy',
            'iot:DeleteThing',
            'iot:DescribeAuthorizer',
            'iot:DescribeCACertificate',
            'iot:DescribeCertificate',
            'iot:DescribeDefaultAuthorizer',
            'iot:DescribeEndpoint',
            'iot:DescribeEventConfigurations',
            'iot:DescribeIndex',
            'iot:DescribeJob',
            'iot:DescribeJobExecution',
            'iot:DescribeRoleAlias',
            'iot:DescribeStream',
            'iot:DescribeThing',
            'iot:DescribeThingGroup',
            'iot:DescribeThingRegistrationTask',
            'iot:DescribeThingType',
            'iot:DetachPolicy',
            'iot:DetachPrincipalPolicy',
            'iot:GetEffectivePolicies',
            'iot:GetIndexingConfiguration',
            'iot:GetJobDocument',
            'iot:GetLoggingOptions',
            'iot:GetOTAUpdate',
            'iot:GetPendingJobExecutions',
            'iot:GetPolicy',
            'iot:GetPolicyVersion',
            'iot:GetRegistrationCode',
            'iot:GetThingShadow',
            'iot:GetTopicRule',
            'iot:GetV2LoggingOptions',
            'iot:ListAttachedPolicies',
            'iot:ListAuthorizers',
            'iot:ListCACertificates',
            'iot:ListCertificates',
            'iot:ListCertificatesByCA',
            'iot:ListIndices',
            'iot:ListJobExecutionsForJob',
            'iot:ListJobExecutionsForThing',
            'iot:ListJobs',
            'iot:ListOTAUpdates',
            'iot:ListOutgoingCertificates',
            'iot:ListPolicies',
            'iot:ListPolicyPrincipals',
            'iot:ListPolicyVersions',
            'iot:ListPrincipalPolicies',
            'iot:ListPrincipalThings',
            'iot:ListRoleAliases',
            'iot:ListStreams',
            'iot:ListTargetsForPolicy',
            'iot:ListThingGroups',
            'iot:ListThingGroupsForThing',
            'iot:ListThingPrincipals',
            'iot:ListThingRegistrationTaskReports',
            'iot:ListThingRegistrationTasks',
            'iot:ListThings',
            'iot:ListThingsInThingGroup',
            'iot:ListThingTypes',
            'iot:ListTopicRules',
            'iot:ListV2LoggingLevels',
            'iot:Publish',
            'iot:Receive',
            'iot:SearchIndex',
            'iot:SetDefaultAuthorizer',
            'iot:SetDefaultPolicyVersion',
            'iot:Subscribe',
            'iot:TestAuthorization',
            'iot:TestInvokeAuthorizer',
            'iot:UpdateThing'
          ],
          'Resource': '*'
        },
        {
          'Sid': 'KinesisGeneric',
          'Effect': 'Allow',
          'Action': [
            'kinesis:DescribeStream',
            'kinesis:GetRecords',
            'kinesis:GetShardIterator',
            'kinesis:ListShards',
            'kinesis:ListStreamConsumers',
            'kinesis:ListStreams',
            'kinesis:PutRecord'
          ],
          'Resource': '*'
        },
        {
          'Sid': 'LogsGeneric',
          'Effect': 'Allow',
          'Action': [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents'
          ],
          'Resource': '*'
        },
        {
          'Sid': 'RDSGeneric',
          'Effect': 'Allow',
          'Action': [
            'rds:DescribeDBClusterSnapshots',
            'rds:DownloadCompleteDBLogFile',
            'rds:DownloadDBLogFilePortion',
            'rds:ListTagsForResource'
          ],
          'Resource': '*'
        },
        {
          'Sid': 'S3Generic',
          'Effect': 'Allow',
          'Action': [
            's3:CreateJob',
            's3:GetAccountPublicAccessBlock',
            's3:HeadBucket',
            's3:ListAllMyBuckets',
            's3:ListJobs',
            's3:PutAccountPublicAccessBlock'
          ],
          'Resource': '*'
        },
        {
          'Sid': 'S3Specific',
          'Effect': 'Allow',
          'Action': [
            's3:*',
            's3:DeleteObject',
            's3:GetObject',
            's3:ListBucket',
            's3:PutObject'
          ],
          'Resource': [
            'arn:aws:s3:::gcv-*',
            'arn:aws:s3:::gcv-*/*',
            'arn:aws:s3:::gsdp-*',
            'arn:aws:s3:::gsdp-*/*',
          ]
        },
        {
          'Sid': 'SecretsManagerSpecific',
          'Effect': 'Allow',
          'Action': [
            'secretsmanager:GetSecretValue',
            'secretsmanager:UpdateSecret'
          ],
          'Resource': [
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:FCL_VALIDATEPIN_TOKEN*'},
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:GCV_FCA_CREDS*'},
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:GCV_IDP_PIN*'},
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:GCV_IGNITE*'},
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:GCV_IGNITE_CREDS*'},
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:GCV_OTP*'},
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:GCV_VENDOR_ADAPTER_CREDS*'},
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:GIGYA*'},
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:OTP_RDS_MARIADB_CREDS*'},
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:PIN_SALT_FCL*'},
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:RDS_MARIADB*'},
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:RDS-MARIADB*'},
            {'Fn::Sub': 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:SUBSCRIPTION_CONFIG*'}
          ]
        },
        {
          'Sid': 'SESGeneric',
          'Effect': 'Allow',
          'Action': [
            'ses:SendEmail'
          ],
          'Resource': '*'
        },
        {
          'Sid': 'SNSGeneric',
          'Effect': 'Allow',
          'Action': [
            'sns:CheckIfPhoneNumberIsOptedOut',
            'sns:CreatePlatformEndpoint',
            'sns:CreateTopic',
            'sns:DeleteTopic',
            'sns:GetEndpointAttributes',
            'sns:GetPlatformApplicationAttributes',
            'sns:GetSMSAttributes',
            'sns:GetSubscriptionAttributes',
            'sns:GetTopicAttributes',
            'sns:ListPhoneNumbersOptedOut',
            'sns:Publish',
            'sns:SetEndpointAttributes',
            'sns:Subscribe',
            'sns:Unsubscribe'
          ],
          'Resource': '*'
        },
        {
          'Sid': 'XRayGeneric',
          'Effect': 'Allow',
          'Action': [
            'xray:PutTelemetryRecords',
            'xray:PutTraceSegments'
          ],
          'Resource': '*'
        }
      ]
}

assume_role_policy_document = {
    'Version': '2012-10-17',
    'Statement': [
        {
            'Sid': 'AssumeRolePermissions',
            'Effect': 'Allow',
            'Action': [
                'sts:AssumeRole'
            ],
            'Principal': {
                'Service': [
                    'lambda.amazonaws.com'
                ]
            }
        }
    ]
}

specific_role_policy_document = {
    'Version': '2012-10-17',
    'Statement': [
        {
            'Sid': 'AssumeRolePermissions',
            'Effect': 'Allow',
            'Action': [
            ],
            'Resource': [
            ]
        }
    ]
}