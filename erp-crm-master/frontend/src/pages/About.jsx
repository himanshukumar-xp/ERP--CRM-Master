import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'ERP CRM Master'}
      subTitle={translate('Do you need help on customize of this app')}
      extra={
        <>
          <p>
            GitHub :{' '}
            <a href="https://github.com/himanshukumar-xp/ERP--CRM-Master">
              https://github.com/himanshukumar-xp/ERP--CRM-Master
            </a>
          </p>
          <Button
            type="primary"
            onClick={() => {
              window.open(`https://github.com/himanshukumar-xp/ERP--CRM-Master/issues`);
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
