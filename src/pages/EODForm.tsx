import React from 'react';
import Layout from '../components/Layout/Layout';
import PhoneSetterForm from '../components/Forms/PhoneSetterForm';
import CloserForm from '../components/Forms/CloserForm';
import DMSetterForm from '../components/Forms/DMSetterForm';
import { useAuth } from '../context/AuthContext';

const EODForm: React.FC = () => {
  const { user } = useAuth();

  const getFormComponent = () => {
    switch (user?.role) {
      case 'phone-setter':
        return <PhoneSetterForm />;
      case 'closer':
        return <CloserForm />;
      case 'dm-setter':
        return <DMSetterForm />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">No EOD form available for your role.</p>
          </div>
        );
    }
  };

  return (
    <Layout 
      title="End of Day Form"
      subtitle="Submit your daily performance metrics"
    >
      {getFormComponent()}
    </Layout>
  );
};

export default EODForm;