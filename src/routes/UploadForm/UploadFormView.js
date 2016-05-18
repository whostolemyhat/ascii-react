import React from 'react';
import UploadForm from 'components/UploadForm/UploadForm';
import Progress from 'components/Progress/Progress';
import Result from 'components/Result/Result';

export const UploadFormView = () => (
    <div>
        <UploadForm />
        <Progress />
        <Result />
    </div>
);

export default UploadFormView;