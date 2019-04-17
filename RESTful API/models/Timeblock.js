class TimeBlock
{
    constructor(timeBlocks)
    {
        this.startDate=timeBlocks.startDate==null? new Date() : timeBlocks.startDate;
        this.startDate=timeBlocks.endDate==null? new Date() : timeBlocks.endDate;
    }
}
module.export={TimeBlock}