import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";

type StackParams = {
  bucketName: string;
  allowIps: string[];
};

export class InfraStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    params: StackParams,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "s3Hosting", {
      bucketName: params.bucketName,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      // httpsにしたいためweb hostingは利用しない。リダイレクトやerror pageが必要であれば使う
      // websiteIndexDocument: "index.html",
      // websiteErrorDocument: "error.html",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        principals: [new iam.AnyPrincipal()],
        actions: ["s3:GetObject"],
        resources: [`${bucket.bucketArn}/*`],
        conditions: {
          IpAddress: {
            "aws:SourceIp": params.allowIps,
          },
        },
      })
    );

    new iam.User(this, "iamContentUploader").addToPolicy(
      new iam.PolicyStatement({
        actions: ["s3:PutObject", "s3:ListBucket", "s3:DeleteObject"],
        resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
      })
    );
  }
}
