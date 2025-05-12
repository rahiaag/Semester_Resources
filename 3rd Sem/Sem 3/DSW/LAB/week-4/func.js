function validateform() {

    var name = document.myform.name.value;
    var num = document.myform.num.value;
    var email = document.myform.email.value;
    var regEx = /^[A-Za-z\s]+$/;
    var dept = document.myform.dept.value;
    //  document.getElementById("demo").innerHTML = x;
    let regexEmail = /.+@(gmail)\.com$/;
    if (name == null || name == "") {
        alert("Name can't be blank");
        return false;
    }
    else if (!name.match(regEx)) {
        alert("Please enter letters and space only in name.");
        return false;
    }

    else if (num == null || num == "") {
        alert("Enrollment number can't be blank");
        return false;
    }
    else if (num.length != 8) {
        alert("Enter 8 digit Enrollment number");
        return false;
    }
    else if (email == null || email == "") {
        alert("email can't be blank");
        return false;
    }
    // else if (!(/@gmail\.com$/.test(string))) {
    ///     alert("You have entered an invalid email address!");
    //     return false;
    // }

    else if (!email.match(regexEmail)) {
        alert("You have entered an invalid email address! ");
        return false;
    }

    else if (dept == null || dept == "") {
        alert("Department can't be blank");
        return false;
    }

    alert("Successful Submission");

}
