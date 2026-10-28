import {
  CheckCircle2,
  Download,
  FileText,
  FolderOpen,
  Pause,
  Play,
  Trash2,
  X,
} from "lucide-react";

import { useDownloads } from "../../context/DownloadContext";

import styles from "./DownloadsPage.module.css";

function formatBytes(bytes) {
  const value = Number(bytes);

  if (!Number.isFinite(value) || value <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];

  const index = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1,
  );

  const converted = value / 1024 ** index;

  return `${converted.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function getStatusLabel(status) {
  if (status === "progressing") {
    return "Downloading";
  }

  if (status === "paused") {
    return "Paused";
  }

  if (status === "completed") {
    return "Completed";
  }

  if (status === "cancelled") {
    return "Cancelled";
  }

  if (status === "interrupted") {
    return "Interrupted";
  }

  return "Unknown";
}

function DownloadsPage({ onBackHome }) {
  const {
    downloads,

    pauseDownload,
    resumeDownload,
    cancelDownload,

    openDownload,
    showDownloadInFolder,

    removeDownload,
    clearFinishedDownloads,
  } = useDownloads();

  const hasFinished = downloads.some((download) => {
    return download.status !== "progressing" && download.status !== "paused";
  });

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.heading}>
          <span className={styles.headingIcon}>
            <Download size={24} />
          </span>

          <div>
            <h1>Downloads</h1>

            <p>Files downloaded with Safora</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          {hasFinished && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clearFinishedDownloads}
            >
              <Trash2 size={16} />
              Clear finished
            </button>
          )}

          <button
            type="button"
            className={styles.homeButton}
            onClick={onBackHome}
          >
            Safora Home
          </button>
        </div>
      </header>

      {downloads.length === 0 ? (
        <div className={styles.emptyState}>
          <Download size={48} />

          <h2>No downloads yet</h2>

          <p>Files downloaded through Safora will appear here.</p>
        </div>
      ) : (
        <div className={styles.downloadList}>
          {downloads.map((download) => {
            const progressing = download.status === "progressing";

            const paused = download.status === "paused";

            const completed = download.status === "completed";

            const interrupted = download.status === "interrupted";

            const removable =
              download.status === "completed" ||
              download.status === "cancelled" ||
              download.status === "interrupted";

            const progress = Math.min(
              100,
              Math.max(0, Number(download.progress) || 0),
            );

            return (
              <article key={download.id} className={styles.downloadItem}>
                <span
                  className={`${styles.fileIcon} ${
                    completed ? styles.completedIcon : ""
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <FileText size={24} />
                  )}
                </span>

                <div className={styles.downloadInfo}>
                  <div className={styles.fileHeading}>
                    <h2 title={download.filename}>{download.filename}</h2>

                    <span
                      className={`${styles.status} ${
                        styles[`status${download.status}`] || ""
                      }`}
                    >
                      {getStatusLabel(download.status)}
                    </span>
                  </div>

                  <div className={styles.progressTrack}>
                    <span
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <div className={styles.downloadMeta}>
                    <span>
                      {formatBytes(download.receivedBytes)}

                      {download.totalBytes > 0 &&
                        ` / ${formatBytes(download.totalBytes)}`}
                    </span>

                    <span>{progress}%</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  {progressing && (
                    <button
                      type="button"
                      onClick={() => pauseDownload(download.id)}
                      title="Pause download"
                    >
                      <Pause size={17} />
                    </button>
                  )}

                  {paused && download.canResume && (
                    <button
                      type="button"
                      onClick={() => resumeDownload(download.id)}
                      title="Resume download"
                    >
                      <Play size={17} />
                    </button>
                  )}

                  {(progressing || paused) && (
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => cancelDownload(download.id)}
                      title="Cancel download"
                    >
                      <X size={17} />
                    </button>
                  )}

                  {completed && (
                    <>
                      <button
                        type="button"
                        onClick={() => openDownload(download.savePath)}
                        title="Open file"
                      >
                        <FileText size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => showDownloadInFolder(download.savePath)}
                        title="Show in folder"
                      >
                        <FolderOpen size={17} />
                      </button>
                    </>
                  )}

                  {removable && (
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => removeDownload(download.id)}
                      title="Remove record"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default DownloadsPage;
