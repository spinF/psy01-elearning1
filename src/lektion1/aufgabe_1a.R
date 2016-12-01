library(xtable)

xtableLinebreakTrick <- function(cellContent) {
  return(paste0('\\begin{tabular}[c]{@{}c@{}}', gsub("\\n", "\\\\\\\\", cellContent), '\\end{tabular}'))
}

data <- read.csv('data/lektion1/dataset_studienanfaenger.csv')

##
# Write frequency table
##

# divide the column 'abiturnote' into 8 classes
abiturnoteClasses <- cut(data$abiturnote, breaks=c(0,1.0,1.5,2.0,2.5,3.0,3.5,4.0,5.0))
# Generate frequency table with columns 'Abiturnote' and 'Freq' containing the frequency of the values
frequencyTable <- as.data.frame(table(abiturnoteClasses, useNA = "ifany"))
# Add columns for cumulative frequency and relative frequency
frequencyTable <- transform(frequencyTable, relFreq = prop.table(Freq))
frequencyTable <- transform(frequencyTable, relCumFreq = cumsum(relFreq))

colnames(frequencyTable)[names(frequencyTable) == 'abiturnoteClasses'] <- xtableLinebreakTrick("Wertebereich\nAbiturnote")
colnames(frequencyTable)[names(frequencyTable) == 'Freq'] <- xtableLinebreakTrick('Absolute\nHäufigkeit')
colnames(frequencyTable)[names(frequencyTable) == 'relFreq'] <- xtableLinebreakTrick('Relative\nHäufigkeit')
colnames(frequencyTable)[names(frequencyTable) == 'relCumFreq'] <- xtableLinebreakTrick('Relative kumulative\nHäufigkeit')

options(xtable.sanitize.text.function=identity)
dir.create("build/latex/gen/lektion1/aufgabe_1a", recursive=TRUE)
print(xtable(frequencyTable, digits=c(1,1,1,3,3), caption='Häufigkeitstabelle für die Abiturnote'), file="build/latex/gen/lektion1/aufgabe_1a/haeufigkeitstabelle.tex", include.rownames=FALSE, table.placement='h')

##
# Plot histogram
##

dir.create("build/latex/gen/lektion1/aufgabe_1b", recursive=TRUE)
pdf('build/latex/gen/lektion1/aufgabe_1a/histogramm.pdf', width=5, height=4)
par(mar=c(4.5,4.5,1,1))
hist(data$abiturnote, breaks=c(0,1.0,1.5,2.0,2.5,3.0,3.5,4.0,5.0), xlab='Abiturnote', ylab="Relative Häufigkeitsdichte", main=NULL, xaxt="n")
axis(1, at=c(0,1,1.5,2.0,2.5,3.0,3.5,4.0,5.0))
dev.off()
