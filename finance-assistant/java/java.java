import java.io.*;
import java.net.*;

public class java {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(5000);
        System.out.println("Server is running...");

        Socket socket = serverSocket.accept();
        BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

        String message = in.readLine();
        System.out.println("Received: " + message);
        out.println(message); // Echo back the message

        socket.close();
        serverSocket.close();
    }
}
