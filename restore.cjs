const { spawn } =require('child_process');
const path =require('path');
const cron =require('node-cron');




const DB_NAME = "beelinkedV2";
const ARCHIVE_PATH = path.join(__dirname, 'public', `${DB_NAME}.gzip`);

cron.schedule('0 0 * * * *', () => backupMongoDB())

function backupMongoDB() {

    const child = spawn('mongodump', [
        `--uri`,
        `mongodb+srv://selim:root@cluster0.nnreb.mongodb.net/${DB_NAME}`,
        `--archive=${ARCHIVE_PATH}`,
        `--gzip`
    ])
    child.stdout.on('data', (data) => {
        console.log('stdout:\n', data)
    })
    child.stderr.on('data', (data) => {
        console.log('stderr:\n', Buffer.from(data).toString())
    })
    child.on('error', (error) => {
        console.log('error:\n', error)
    })
    child.on('exit', (code, signal) => {
    if (code) console.log('Process exit with code:', code)
    else if (signal) console.log('Process killed with signal', signal)
    else console.log('Backup is successful')    
})

}


// mongodump --uri mongodb+srv://selim:root@cluster0.nnreb.mongodb.net/smokeless  --archive=./smokeless.gzip --gzip
//  mongorestore --uri mongodb+srv://selim:root@cluster0.nnreb.mongodb.net  --archive=./smokeless.gzip --gzip 