import React, { useEffect } from 'react';

type IStep3Props = {}

const IStep3DefaultProps = {}

const Step3: React.FC<IStep3Props> = (props) => {
  const {} = props;

  useEffect(() => {

  }, []);

  return (
    <React.Fragment>
        Step 3
    </React.Fragment>
  )
}

Step3.defaultProps = IStep3DefaultProps;

export default Step3;