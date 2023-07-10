const express=require("express");
const cors= require("cors");
const fileUpload=require("express-fileupload");
const bodyparser=require("body-parser");
const database=require("mysql");
const {application,request,response}=require("express");

const add=express();
add.use(cors());
add.use(fileUpload());
add.use(bodyparser.json());
add.use(express.json());
add.use(express.static('public'));

let a=database.createConnection({
    host:"localhost",
    user:"root",
    password:"142827",
    database:"employeedetails"
});

a.connect(function(error){
    if(error){
        console.log(error);
    }else{
        console.log("Database Connected");
    }
})

add.post('/InsertUser',(request,response)=>{
    try {
        try{
            console.log(JSON.stringify(request.body));
            let {firstname, lastname, gender, dateofbirth, mailid, mobile, password}=request.body;
            if(firstname!=null&&lastname!=null&&gender!=null&&dateofbirth!=null&&mailid!=null&&mobile!=null&&password!=null){
            let sql='insert into staffdetails (firstname, lastname, gender, dateofbirth, emailid, phone, password,effectivefrom,effectiveto,status,createdby,createdon) values(?,?,?,?,?,?,?,current_timestamp(),current_timestamp()+interval 1 year,"A",?,current_timestamp())';
            a.query(sql,[firstname, lastname, gender, dateofbirth, mailid, mobile, password,firstname],(error,result)=>{
                if(error){
                    let s={"status":"error"};
                    response.send(s);
                    console.log(error);
                }else{
                    let s={"status":"success"};
                    response.send(s);
                }
            })}else{
                let s={"status":"InvalidData"};
                response.send(s);
            }
        }catch(app_error){
            response.send(app_error);
        }
    } catch (system_error) {
        response.send(system_error)
    }
})

add.post('/LoginUser',(request,response)=>{
    try {
        try {
            let {emailid, password}=request.body;
            let sql='select id,firstname,emailid, password from staffdetails where emailid=? and password=? and status="A"';
            a.query(sql,[emailid,password],(error,result)=>{
                if(error){
                    console.log(error);
                }else{
                    if(result.length >0){
                        let msg={
                            "message":"Log-In Successfully",
                            "userid":result[0].id,
                            "username":result[0].emailid,
                            "firstname":result[0].firstname
                        }
                        response.send(msg);
                    }else{
                        let msg={
                            "message":"user details not matched"
                        }
                        response.send(msg);
                    }
                }
            })
        } catch (app_error) {
            response.send(app_error);
        }
    } catch (system_error) {
        response.send(system_error);
    }
});

add.get('/SelectDashboard',(request,response)=>{
    try {
        try {
            let sql='select dashboard_image, description, dashboard_name, dashboard_code, dashboard_button from dashboard where status="A";';
            a.query(sql,(error,result)=>{
            if(error){
                console.log(error);
            }else{
                response.send(result);
            }
            })
        } catch (app_error) {
            response.send(app_error)
        }
    } catch (system_error) {
        response.send(system_error);
    }
});

add.post('/AttendanceLogin',(request,response)=>{
    try {
        try{
            console.log(JSON.stringify(request.body));
            let {userid,username,logintime}=request.body;
            if(userid!=null&&username!=null&&logintime!=null){
            let sql='insert into attendance (user_id, username,logintime,effectivefrom,effectiveto,status,createdby,createdon) values(?,?,?,current_timestamp(),current_timestamp()+interval 1 year,"A",?,current_timestamp())';
            a.query(sql,[userid,username,logintime,userid],(error,result)=>{
                if(error){
                    let s={"status":"error"};
                    response.send(s);
                    console.log(error);
                }else{
                    let s={"status":"success"};
                    response.send(s);
                }
            })}else{
                let s={"status":"InvalidData"};
                response.send(s);
            }
        }catch(app_error){
            response.send(app_error);
        }
    } catch (system_error) {
        response.send(system_error)
    }
})

add.put('/AttendanceLogOut',(request,response)=>{
    try {
        try{
            console.log(JSON.stringify(request.body));
            let {userid,username,logouttime}=request.body;
            if(userid!=null&&username!=null&&logouttime!=null){
            let sql='update attendance set logouttime=? , modifiedby=? , modifiedon=current_timestamp() where user_id=? and username=?';
            a.query(sql,[logouttime,userid,userid,username],(error,result)=>{
                if(error){
                    let s={"status":"error"};
                    response.send(s);
                    console.log(error);
                }else{
                    let s={"status":"success"};
                    response.send(s);
                }
            })}else{
                let s={"status":"InvalidData"};
                response.send(s);
            }
        }catch(app_error){
            response.send(app_error);
        }
    } catch (system_error) {
        response.send(system_error)
    }
})

add.get('/FetchLogin/:userid',(request,response)=>{
    try {
        try{
            // console.log(JSON.stringify(request.params));
            let {userid}=request.params;
            console.log(userid);
            if(userid!=null){
            let sql='select user_id,username,logintime,logouttime from attendance where user_id=? and status="A" and date(logintime) = current_date()';
            a.query(sql,[userid],(error,result)=>{
                if(error){
                    let s={"status":"error"};
                    response.send(s);
                    console.log(error);
                }else{
                    console.log(result);
                    let s={"status":"success","data":result};
                    response.send(s);
                }
            })}else{
                let s={"status":"InvalidData"};
                response.send(s);
            }
        }catch(app_error){
            response.send(app_error);
        }
    } catch (system_error) {
        response.send(system_error)
    }
})

add.post('/LeaveRequest',(request,response)=>{
    try {
        try{
            console.log(JSON.stringify(request.body));
            let {userid,username,leavedate,reason}=request.body;
            if(userid!=null&&username!=null&&leavedate!=null&&reason!=null){
                let sql='insert into leave_request (userid, username,leavedate,reason,permission,effectivefrom,effectiveto,status,createdby,createdon) values(?,?,?,?,"pending",current_timestamp(),current_timestamp()+interval 1 year,"A",?,current_timestamp())';
            a.query(sql,[userid,username,leavedate,reason,userid],(error,result)=>{
                if(error){
                    let s={"status":"error"};
                    response.send(s);
                    console.log(error);
                }else{
                    let s={"status":"success"};
                    response.send(s);
                }
            })}else{
                let s={"status":"InvalidData"};
                response.send(s);
            }
        }catch(app_error){
            response.send(app_error);
        }
    } catch (system_error) {
        response.send(system_error)
    }
})

add.get('/HolidayList',(request,response)=>{
    try {
        try {
            let sql='select holiday_date,holiday_name,holiday_image,festival_description from holiday_list where status="A" order by holiday_date;';
            a.query(sql,(error,result)=>{
            if(error){
                console.log(error);
            }else{
                response.send(result);
            }
            })
        } catch (app_error) {
            response.send(app_error)
        }
    } catch (system_error) {
        response.send(system_error);
    }
});

add.listen(1200,()=>{
    console.log("server is running on 1200 port");
});
