import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

const SubscriptionModal = ({ course, onConfirm, onCancel }) => {
  const { t } = useTranslation(['translation', 'course']);

  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-md shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('subscribe_confirmation.title')}</h2>
        <p className="text-gray-800 mb-6">{t('subscribe_confirmation.message', { courseName: t(`${course.id}.title`, { ns: 'course' }) })}</p>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>{t('subscribe_confirmation.cancel')}</Button>
          <Button onClick={() => onConfirm(course.id)}>{t('subscribe_confirmation.confirm')}</Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;