
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getStats } from '../services/statsService';
import { getParameters } from '../services/parameterService';

const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [parameters, setParameters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getStats();
        setStats(statsData);

        const parametersData = await getParameters();
        setParameters(parametersData);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-base-content mb-8">{t('admin_dashboard.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 bg-neutral rounded-lg border-2 border-neutral shadow-[4px_4px_0px_#00F6FF]">
          <h3 className="text-xl font-bold text-base-content mb-4">{t('admin_dashboard.stats')}</h3>
          {stats && (
            <ul className="space-y-2">
              <li>{t('admin_dashboard.users')}: {stats.users}</li>
              <li>{t('admin_dashboard.courses')}: {stats.courses}</li>
              <li>{t('admin_dashboard.subscriptions')}: {stats.subscriptions}</li>
            </ul>
          )}
        </div>
        <div className="p-6 bg-neutral rounded-lg border-2 border-neutral shadow-[4px_4px_0px_#00F6FF]">
          <h3 className="text-xl font-bold text-base-content mb-4">{t('admin_dashboard.parameters')}</h3>
          {parameters && (
            <ul className="space-y-2">
              {parameters.map(param => (
                <li key={param.key}>{param.key}: {param.value}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
