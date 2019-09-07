/*
[URL Rewrite]
^https://aweme-eagle(.*)\.snssdk\.com/aweme/v2/ https://aweme-eagle$1.snssdk.com/aweme/v1/ 302

[Script]
http-response ^https://[\s\S]*\/aweme/v1/(feed|aweme/post|follow/feed)/ requires-body=1,max-size=-1,script-path=https://Choler.github.io/Surge/Script/Aweme.js

[MITM]
hostname = *.amemv.com, *.snssdk.com
*/

let body = $response.body.replace(/watermark=1/g, "watermark=0");
var obj = JSON.parse(body);
if (obj.aweme_list) {
  for (var i = obj.aweme_list.length - 1; i >= 0; i--) {
    if (obj.aweme_list[i].raw_ad_data) {
      obj.aweme_list.splice(i, 1);
    }
    if (obj.aweme_list[i].poi_info) {
      delete obj.aweme_list[i].poi_info;
    }
    if (obj.aweme_list[i].sticker_detail) {
      delete obj.aweme_list[i].sticker_detail;
    }
    if (obj.aweme_list[i].simple_promotions) {
      delete obj.aweme_list[i].simple_promotions;
    }
    if (obj.aweme_list[i].interaction_stickers != null) {
      obj.aweme_list[i].interaction_stickers = null;
    }
    if (obj.aweme_list[i].video_control.allow_download != true) {
      obj.aweme_list[i].status.reviewed = 1;
      obj.aweme_list[i].video_control.allow_download = true;
    }
  }
  $done({body: JSON.stringify(obj)});
} else if (obj.data) {
  for (var i = obj.data.length - 1; i >= 0; i--) {
    if (obj.data[i].aweme) {
      if (obj.data[i].aweme.poi_info) {
        delete obj.data[i].aweme.poi_info;
      }
      if (obj.data[i].aweme.simple_promotions) {
        delete obj.data[i].aweme.simple_promotions;
      }
      if (obj.data[i].aweme.video_control.allow_download != true) {
        obj.data[i].aweme.status.reviewed = 1;
        obj.data[i].aweme.video_control.allow_download = true;
      }
    } else {
      obj.data.splice(i, 1);
    }
  }
  $done({body: JSON.stringify(obj)});
} else {
  $done({body});
}