import Report from "../report/reports.model"
import { status } from "../report/status"
import Student from "../student/student.model"
import moment from 'moment'

const generateDailyReport = async () => {
    try {
       const isGenerated = await Report.findOne({
        createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
       })

       if(isGenerated) {
           return console.log('Already generated');
       }
       const students = await Student.find({})
       const today = moment().format('ddd')
       const reports = await students.map(async (student) => {
        
           const report = new Report({
               student: student._id,
               center: student.center,
               classRoom: student.classRoom,
               status: student.days.includes(today) ? status.notAssigned : status.scheduled
           })

           await report.save()
           await student.updateOne({ $set: { report: report._id } })
       })
       console.log("Done");
    } catch (error) {
        console.log(error)
    }
}


export default generateDailyReport