import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

export const createValidator = (schema) => {
  const validate = ajv.compile(schema);

  const verify = (data) => {
    const isValid = validate(data);
    if (isValid) {
      return data;
    }
    const errors = validate.errors ? validate.errors.filter((err) => err.keyword !== "if") : [];
    const errorMessage = `Validation failed: ${ajv.errorsText(errors, {
      dataVar: "schemaValidation"
    })}\n\n${JSON.stringify(data, null, 2)}`;
    throw new Error(errorMessage);
  };

  return { schema, verify };
};
