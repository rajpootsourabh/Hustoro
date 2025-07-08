// src/utils/validators/timeOffRequestValidator.js
import * as Yup from 'yup';

export const timeOffRequestSchema = Yup.object().shape({
  selectedType: Yup.string().required('Time off type is required'),

  dateRange: Yup.mixed().test('dateRange-check', 'Invalid date range', function (_, context) {
    const { startDate, endDate } = context.parent;

    if (!startDate && !endDate) {
      return this.createError({ path: 'dateRange', message: 'Start and end date are required' });
    }
    if (!startDate || !endDate) {
      return this.createError({ path: 'dateRange', message: 'Start date or end date is not selected' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start < today) {
      return this.createError({ path: 'dateRange', message: 'Start date cannot be in the past' });
    }

    if (end < start) {
      return this.createError({ path: 'dateRange', message: 'End date must be equal to or after start date' });
    }

    return true;
  }),

  firstDayType: Yup.string().required('Please select First day type'),
  lastDayType: Yup.string().required('Please select Last day type'),
  note: Yup.string().optional(),

  sickLeaveFile: Yup.mixed().when('selectedType', {
    is: '2',
    then: schema => schema.required('Medical document is required'),
    otherwise: schema => schema.notRequired(),
  }),
});
