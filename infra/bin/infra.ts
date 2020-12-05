#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { InfraStack } from "../lib/infra-stack";

function env(key: string) {
  const value = process.env[key];
  if (value == undefined) console.error(`[ERROR] ENV not found: ${key}`);
  return value ?? "";
}

const app = new cdk.App();
new InfraStack(app, "InfraStack", {
  bucketName: env("BUCKET_NAME"),
  allowIps: env("ALLOW_IPS").split(","),
});
