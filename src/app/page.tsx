import './styles/globals.scss';
import BloodGlucoseForm from './components/BloodGlucoseForm';
import Header from './components/Header';

const Page = () => {
  return (
    <div>
      <Header />
      <div className="page-content">
        <BloodGlucoseForm />
      </div>
    </div>
  );
};

export default Page;

