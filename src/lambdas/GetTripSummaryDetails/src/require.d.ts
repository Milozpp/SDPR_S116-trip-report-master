declare module "*.json" {
    const value: any;
    export default value;
}

declare module 'gcv-lambda-tracer' {
    let LambdaTracer: any;
    export { LambdaTracer };
}
