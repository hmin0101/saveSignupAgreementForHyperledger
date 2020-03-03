const db = require("../db_query");

module.exports = {

    /* Register */
    confirmDuplication: async function(userId) {
        try {
            const selectQ = 'select count(*) as count from user where id="'+userId+'";';
            const result = await db.asyncSelect(selectQ);
            if (result.result) {
                console.log(result);
                if (result.message[0].count > 0) {
                    return {result: false, message: "이미 존재하는 ID 입니다."};
                } else {
                    return {result: true, message: "사용 가능한 ID 입니다."};
                }
            } else {
                return result;
            }
        } catch (err) {
            return err;
        }
    },

    register: async function(info, keyName) {
        try {
            const insert_user_Q = 'insert into user(name, id, password) values ("' + info.name + '", "' + info.id + '", "' + info.pw + '");';
            const insert_user_R = await db.asyncQuery(insert_user_Q);
            console.log(insert_user_R);
            if (insert_user_R.result) {
                const insert_key_Q = 'insert into public_key(user_id, key_name) values (' + insert_user_R.message.insertId + ', "' + keyName + '");';
                return await db.asyncQuery(insert_key_Q);
            } else {
                return insert_user_R;
            }
        } catch (err) {
            return err;
        }
    },

    /* Remain */
    login: async function(userId) {
        try {
            const selectQ = 'select * from user where id="'+userId+'" limit 1;';
            return await db.asyncSelect(selectQ);
        } catch(err) {
            return err;
        }
    },

    /**/
    saveBlockInfo: async function(uuid, blockInfo) {
        try {
            const insertQ = 'insert into block_info(user_id, block_num, tx_id) values (' + uuid + ', ' + blockInfo.blockID + ', "' + blockInfo.txID + '");';
            const saveBlockInfoResult = await db.asyncQuery(insertQ);
            if (saveBlockInfoResult.result) {
                const insertQ = 'insert into enc_key(block_info_id, b_key) values (' + saveBlockInfoResult.message.insertId + ', "' + blockInfo.b_key + '");';
                return await db.asyncQuery(insertQ);
            } else {
                return saveBlockInfoResult;
            }
        } catch (err) {
            return err;
        }
    },

    searchBlockId: async function(uuid) {
        try {
            const selectQ = 'select a.block_num, a.tx_id, b.b_key from block_info as a inner join enc_key as b on a.block_info_id=b.block_info_id and a.user_id='+uuid+' order by a.create_date DESC limit 1;';
            return await db.asyncSelect(selectQ);
        } catch(err) {
            return err;
        }
    },

    searchPublicKey: async function(uuid) {
        try {
            const selectQ = 'select key_name from public_key where user_id='+uuid+' order by public_key_id DESC limit 1;';
            return await db.asyncSelect(selectQ);
        } catch(err) {
            return err;
        }
    },

    updatePublicKey: async function(uuid, keyName) {
        try {
            const updateQ = 'update public_key set key_name="' + keyName + '" where uuid=' + uuid + ';';
            return await db.asyncQuery(updateQ);
        } catch (err) {
            return err;
        }
    }

};