from private._server import TavernServer
from private.router import *
import threading
import signal
import subprocess
import time

def handle_shutdown(signum, frame):
    print(f"Shutting down due to signal {signum}")

    tavern = TavernServer.get()
    if tavern.conversation.messages != {}:
        tavern.db.save_conversation(tavern.conversation)
    tavern.running = False
    
    subprocess.run(f"ollama stop {tavern.llama_current_model}")
    exit(0)

if __name__ == "__main__":
    tavern = TavernServer.get()

    signal.signal(signal.SIGINT, handle_shutdown)
    signal.signal(signal.SIGTERM, handle_shutdown)
    signal.signal(signal.SIGABRT, handle_shutdown)
    
    serverThread = threading.Thread(target=tavern.flask_app.run)
    serverThread.start()

    while tavern.running:
        time.sleep(100)