// functions
function checkMail(mail){
    mailservice = mail.split('@')[1].split('.')[0];
    if (mailservice == 'gmail' || mailservice == "yahoo"){
        return true;
    }else{return false;}
};
function checkPassword(str){
    var re = /^(?=.*[!@#$%^&*]).{2,10}$/;
    return re.test(str);
};
function checkValues(firstname,lastname,mail,password){
    let continueTOForm = true;
    if (firstname.length){
        if (!(firstname.length < 20 && firstname.length > 2)){
        continueTOForm = false;
        }
    }
    if (lastname.length){
        if (!(lastname.length < 20 && lastname.length > 2)){
        continueTOForm = false;
        }
    }
    if ( !( checkMail(mail) ) ) {
        continueTOForm = false;
    }
    if (!(checkPassword(password))){
        continueTOForm = false;
    }
    return continueTOForm;
}
module.exports={
    checkValues,
    checkPassword
};