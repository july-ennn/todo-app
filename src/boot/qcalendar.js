import { boot } from 'quasar/wrappers'
import '@quasar/quasar-ui-qcalendar/dist/index.css'
import QCalendar from '@quasar/quasar-ui-qcalendar'

export default boot(({ app }) => {
  app.use(QCalendar)
})