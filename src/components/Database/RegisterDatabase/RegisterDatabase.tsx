import RegisterDatabaseForm from "./RegisterDatabaseForm";
import useRegisterDatabase from "./useRegisterDatabase";
import StatusAlert from "../../Shared/statusAlert";

const RegisterDatabase = () => {
  const { database, status, handleInputChange, handleSubmit, alertProps } = useRegisterDatabase();

  return (
    <>
    {status}
      <StatusAlert {...alertProps} />
      <RegisterDatabaseForm
        database={database}
        status={status}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default RegisterDatabase;
