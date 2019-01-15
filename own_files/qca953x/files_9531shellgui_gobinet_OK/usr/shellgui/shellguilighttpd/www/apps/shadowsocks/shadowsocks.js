function getEmptyConfig(){return data={desc:"",data:{method:"table",password:"",server:"",local_address:"",server_port:"",timeout:"",local_port:""}}}function resetPageData(e){statusData=e.status,$("#server_status").html(1==statusData.server?UI.Runed:UI.Not_Runed),$("#local_status").html(1==statusData.local?UI.Runed:UI.Not_Runed),$("#redir_status").html(1==statusData.redir?UI.Runed:UI.Not_Runed),serverData=e.server.data,serverData.enabled=e.server.enabled,setServerData(serverData),configData=e.client_configs,setClientConfig(configData),localData=e.local,setLocal(localData),redirData=e.redir,setRedir(redirData)}function setServerData(e){$("#server_enabled").prop("checked",1==e.enabled),$("#server_bind_ip").val(e.server),$("#server_bind_port").val(e.server_port),$("#server_password").val(e.password),$("#server_timeout").val(e.timeout),$("#enc_method").val(e.method)}function setClientConfig(e){$("#local_config,#redir_config,#config_container").empty();for(var a in e){$("#local_config,#redir_config").append('<option value="'+a+'">'+e[a].desc+"</option>");var t='<tr data-id="'+a+'"><td>'+e[a].desc+'</td><td><button class="btn btn-default btn-xs edit_config" data-id="'+a+'"data-toggle="modal" data-target="#configModal">'+UI.Edit+'</button></td><td><button class="btn btn-danger btn-xs remove_config" data-id="'+a+'">'+UI.Remove+"</button></td></tr>";$("#config_container").append(t)}$(".edit_config").click(function(){var e=$(this).attr("data-id"),a=configData[e];editConfig(e,a)}),$(".remove_config").click(function(){var e=$(this).attr("data-id");removeConfig(e)})}function setLocal(e){$("#local_enabled").prop("checked",1==e.enabled),$("#local_config").val(e.client_config)}function setRedir(e){$("#redir_enabled").prop("checked",1==e.enabled),$("#redir_config").val(e.client_config),$("#geoip_cc").val(e.external.except_cc.join(",")),$("#geoip_cc").focus(function(){$(this).parent().find(".help-block").removeClass("hidden")}),$("#geoip_cc").blur(function(){$(this).parent().find(".help-block").addClass("hidden")}),$("#hit_ips").val(e.external.except_ips.join("\n")),$("#internal_mode").prop("checked","all"==e.internal_mode),$("#internal_except_ips").val(e.internal.except_ips.join("\n")),$("#internal_hit_ips").val(e.internal.hit_ips.join("\n")),$("textarea").focus(function(){$(this).parent().find(".help-block").removeClass("hidden")}).blur(function(){$(this).parent().find(".help-block").addClass("hidden")})}function editConfig(e,a){$("#configModalLabel").html(UI.Edit_Client_Config),$("#save_config").attr("data-type","edit").attr("data-id",e).html(UI.Save),setConfigForm(a)}function addConfig(){$("#configModalLabel").html(UI.Add_new_Client_Config),$("#save_config").attr("data-type","add").attr("data-id",0).html(UI.Add);var e=getEmptyConfig();setConfigForm(e)}function setConfigForm(e){$("#config_desc").val(e.desc),$("#config_server_ip").val(e.data.server),$("#config_server_port").val(e.data.server_port),$("#config_password").val(e.data.password),$("#config_local_ip").val(e.data.local_address),$("#config_local_port").val(e.data.local_port),$("#config_timeout").val(e.data.timeout),$("#config_enc_method").val(e.data.method)}function saveConfig(e,a){var t=getEmptyConfig().data;t.method=$("#config_enc_method").val(),t.password=$("#config_password").val(),t.server=$("#config_server_ip").val(),t.server_port=parseInt($("#config_server_port").val()),t.local_address=$("#config_local_ip").val(),t.local_port=parseInt($("#config_local_port").val()),t.timeout=parseInt($("#config_timeout").val()),configData[a]={data:t,desc:$("#config_desc").val()},setClientConfig(configData),$("#configModal").modal("hide")}function removeConfig(e){var a={};for(var t in configData)parseInt(t)<parseInt(e)?a[parseInt(t)]=configData[t]:parseInt(t)>parseInt(e)&&(a[parseInt(t)-1]=configData[parseInt(t)-1]);configData=a,setClientConfig(configData)}function submitPage(){var e={client_configs:configData,server:getServerData(),local:getLocalData(),redir:getRedirData()},a={app:"shadowsocks",action:"set_shadowsocks",data:JSON.stringify(e)};$("input,select,button,textarea").prop("disabled",!0),$.post("/",a,function(e){Ha.showNotify(e),$("input,select,button,textarea").prop("disabled",!1)},"json")}function getServerData(){var e={enabled:1==$("#server_enabled").prop("checked")?1:0,data:{server:$("#server_bind_ip").val(),method:$("#enc_method").val(),password:$("#server_password").val(),server_port:parseInt($("#server_bind_port").val()),timeout:parseInt($("#server_timeout").val())}};return e}function getLocalData(){var e={enabled:1==$("#local_enabled").prop("checked")?1:0,client_config:$("#local_config").val()};return e}function getRedirData(){var e={enabled:1==$("#redir_enabled").prop("checked")?1:0,client_config:$("#redir_config").val(),external:{except_cc:$("#geoip_cc").val().split(","),except_ips:getCleanArr($("#hit_ips").val().split("\n"))},internal:{hit_ips:getCleanArr($("#internal_hit_ips").val().split("\n")),except_ips:getCleanArr($("#internal_except_ips").val().split("\n"))},internal_mode:1==$("#internal_mode").prop("checked")?"all":""};return e}function getCleanArr(e){for(var a=0;a<e.length;a++)""==e[a]&&e.splice(a,1);return e}var originData,serverData,configData,localData,redirData,statusData;$.post("/","app=shadowsocks&action=get_client_configs",function(e){originData=e,resetPageData(originData)},"json"),$("#add_config_btn").click(addConfig),$("#save_config").click(function(){var e=$(this).attr("data-type"),a=$(this).attr("data-id");if(0==a){var t=0;for(var n in configData)t++;a=t+1}saveConfig(e,a)}),$("#reset_page_btn").click(function(){$.post("/","app=shadowsocks&action=get_client_configs",resetPageData,"json")}),$("#save_page_btn").click(submitPage);