const Email = localStorage.getItem("email");
const AreaSel = localStorage.getItem("area");

var DBValues = [2, 1];
var WorkersValues = [1, 2];

var newAll;


function checkisLoggedIn()
{

    if(!Email)
    {
        alert("Please Login First !");
        window.location.href = "/";
        return;
    }

    document.querySelector("#DropMenu").innerHTML = Email;
    document.querySelector(".AreaName").innerHTML = AreaSel;

}

function changeMenuItem(toShow)
{

    document.getElementById("#chairDash").style.display = "none";
    document.getElementById("#chairAllReviewers").style.display = "none";
    document.getElementById("#chairAssign").style.display = "none";
    document.getElementById("#chairAllPublished").style.display = "none";
    
    document.getElementById("#"+toShow).style.display = "flex";

}

function chartsFilledEmpty()
{

    const xValues = ["Filled Dustbins", "Empty Dustbins"];
    const barColors = ["#b91d47","#00aba9"];

    new Chart("DB_Stats1", {
        type: "pie",
        data: {
            datasets: [{
                backgroundColor: barColors,
                data: DBValues
            }],
            labels: xValues,
        },
        options: {
            title: {
            display: true,
            text: "Dustbin Stats"
            }
        }
    });

}

function chartsWorkers()
{

    const xValues = ["Absent Workers", "Present Workers"];
    const barColors = ["#b91d47","#00aba9"];

    new Chart("DB_Stats2", {
        type: "pie",
        data: {
            datasets: [{
                backgroundColor: barColors,
                data: WorkersValues
            }],
            labels: xValues,
        },
        options: {
            title: {
                display: true,
                text: "Workers Stats"
            }
        }
    });

}

var module = angular.module("myModule",[]);

module.controller("myController",function($scope, $http)
{

    $scope.fetchAREAS = () => {

        const url = "/fetchAreas?email=" + Email;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            $scope.areaDATA = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.openAreaDet = (AName) => {

        localStorage.setItem("area", AName);

        window.location.href = "/Area-Details";

    };

    $scope.showContactAlert = (Contact) => {
        alert('Contact No : ' + Contact);
    };

    $scope.fetchAreaStats1 = () => {

        const url = "/getDustBinFilled?area=" + AreaSel;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            $scope.All_D_B_Filled = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.fetchAreaStats2 = () => {

        const url = "/getDustBinData?area=" + AreaSel;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            $scope.All_D_B_Data = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.fetchAreaStats2 = () => {

        const url = "/getDustBinData?area=" + AreaSel;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            $scope.All_D_B_Data = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

    $scope.fetchAreaStats3 = () => {

        const url = "/getWorkerData?Area=" + AreaSel;
        
        $http.get(url).then(done, fail);
        
        function done(resp)
        {
            $scope.workerData = resp.data;
        }
        
        function fail(err)
        {
            alert(JSON.stringify(err.data));
        }

    };

})


$(document).ready( () => {

    $("#LogoutBTN").click( () => {
        
        localStorage.clear();
        window.location.href = "/";
        
    })

    $("#chngPassBtn").click( () => {

        var curPass = $("#CngCurrPass").val();
        var newPass = $("#CngNewPass").val();

        if(!curPass)
            $("#CngCurrPassErr").html("Enter Current Password !").css("color", "red");
        else
            $("#CngCurrPassErr").html("");

        if(!newPass)
            $("#CngNewPassErr").html("Enter New Password !").css("color", "red");
        else
            $("#CngNewPassErr").html("");
        

        if(curPass && newPass)
        {

            var obj = {
                type : "get",
                url : "/cngPass",
                data : {
                    Email : Email,
                    cPass : curPass,
                    nPass : newPass
                }
            }

            $.ajax(obj).done( (resp) => 
            {
                alert(resp);
            })
            .fail( (err) => {
                alert(JSON.stringify(err));
            })

        }

    })

    $("#addWorkerBtn").click( () => {

        var Name = $("#addNameTxt").val();

        if(Name == "" || !Name || Name == " ")
        {
            alert("Please Enter Name !");
            return;
        }

        var Number = prompt("Enter Contact No.");

        var obj3 = {
            type : "get",
            url : "/AddNewWorker",
            data : {
                name : Name,
                area : AreaSel,
                number : Number,
            }
        }

        $.ajax(obj3).done( (resppp) =>{
            if(resppp == "DONE")
                location.reload();
        })
        .fail( (errrr) => {
            alert(errrr);
        })

    })

})