import { Steps } from 'antd';
import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';

const StepProgress = ({ direction, record, allSteps }) => {
  const getStepStatus = (index, currentIndex, latestStepHasOutTime, totalSteps) => {
    const isLastStep = index === totalSteps - 1;

    if (index < currentIndex) return 'finish';
    if (index === currentIndex) {
      return isLastStep ? 'finish' : 'process';
    }
    return 'wait';
  };

  const getStepIcon = (status) => {
    if (status === 'process') return <LoadingOutlined style={{ fontSize: '25px', color: '#1890ff' }} />;
    if (status === 'finish') return <CheckCircleFilled style={{ fontSize: '25px', color: 'green' }} />;
    return <div style={{ width: 16, height: 16 }} />;
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (inTimeStr, outTimeStr) => {
    if (!inTimeStr || !outTimeStr) return '';
    const inTime = new Date(inTimeStr);
    const outTime = new Date(outTimeStr);
    if (isNaN(inTime) || isNaN(outTime) || outTime < inTime) return '';

    const diffMs = outTime - inTime;
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m`;
  };

  const statusArray = record.statuses || [];

  const latestStep = statusArray.at(-1);
  const latestStepName = latestStep?.status || '';
  const currentStepIndex = allSteps.findIndex(
    (step) => step?.toLowerCase() === latestStepName?.toLowerCase()
  );

  const latestStepHasOutTime = !!statusArray[currentStepIndex + 1]?.createdAt;
const steps = allSteps.map((step, index) => {
  const title = step
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const status = getStepStatus(index, currentStepIndex, latestStepHasOutTime, allSteps.length);
  const icon = getStepIcon(status);

  const stepStatus = statusArray[index];
  const inTime = stepStatus?.createdAt;
  const outTime = statusArray[index + 1]?.createdAt;
  const comment = stepStatus?.comment;
  const employee = stepStatus?.employee?.name;

  let description = null;
  if (inTime) {
    const inFormatted = formatDateTime(inTime);
    const outFormatted = formatDateTime(outTime);
    const duration = calculateDuration(inTime, outTime);

    description = (
     <>
      <div>
        In: {inFormatted}
        {outFormatted && ` | Out: ${outFormatted}`}
        {duration && ` | Duration: ${duration}`}
      </div>
      {comment && <div>Comment: {comment}</div>}
      {employee && <div>Request by: {employee}</div>}
    </>
    );
  }

  return { title, status, icon, description };
});


  
  return (
    <Steps direction={direction} className="custom-steps" items={steps} />
  );
};

export default StepProgress;
